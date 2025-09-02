import { TList } from '../query/Query.interface';
import { userSearchableFields as searchFields } from './User.constant';
import prisma from '../../../util/prisma';
import { EUserRole, Prisma, User as TUser } from '../../../../prisma';
import { TPagination } from '../../../util/server/serveResponse';
import { deleteFile } from '../../middlewares/capture';
import { TUserRegister } from './User.interface';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from '../auth/Auth.service';
import { errorLogger } from '../../../util/logger/logger';
import { otpGenerator } from '../../../util/crypto/otpGenerator';
import config from '../../../config';
import { otp_send_template } from '../../../templates';
import ms from 'ms';
import { sendEmail } from '../../../util/sendMail';

export const UserServices = {
  async create({ password, name, email, phone }: TUserRegister) {
    AuthServices.validEmailORPhone({ email, phone });

    //! check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser)
      throw new ServerError(
        StatusCodes.CONFLICT,
        `User already exists with this ${email ? 'email' : ''} ${phone ? 'phone' : ''}`.trim(),
      );

    const otp = otpGenerator(config.otp.length);

    try {
      if (email)
        sendEmail({
          to: email,
          subject: `Your ${config.server.name} Account Verification OTP is ⚡ ${otp} ⚡.`,
          html: otp_send_template({
            userName: name,
            otp,
            template: 'account_verify',
          }),
        });
    } catch (error: any) {
      errorLogger.error(error.message);
    }

    //! finally create user and in return omit auth fields
    return prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: await password.hash(),
        role: EUserRole.USER,
        otp,
        otp_expires_at: new Date(Date.now() + ms(config.otp.exp)),
      },
      omit: {
        password: true,
        otp: true,
        driver_info: true,
      },
    });
  },

  async updateUser({
    user,
    body,
  }: {
    user: Partial<TUser>;
    body: Partial<TUser>;
  }) {
    if (body.avatar) user?.avatar?.__pipes(deleteFile);

    return prisma.user.update({
      where: { id: user.id },
      data: body,
    });
  },

  async getAllUser({
    page,
    limit,
    search,
    omit,
    ...where
  }: Prisma.UserWhereInput & TList & { omit: Prisma.UserOmit }) {
    where ??= {} as any;

    if (search)
      where.OR = searchFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));

    const users = await prisma.user.findMany({
      where,
      omit,
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.user.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } as TPagination,
      },
      users,
    };
  },

  async getUserById({
    userId,
    omit = undefined,
  }: {
    userId: string;
    omit?: Prisma.UserOmit;
  }) {
    return prisma.user.findUnique({
      where: { id: userId },
      omit,
    });
  },

  async getUsersCount() {
    const counts = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        _all: true,
      },
    });

    return Object.fromEntries(
      counts.map(({ role, _count }) => [role, _count._all]),
    );
  },

  async delete(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    user?.avatar?.__pipes(deleteFile); // delete avatar

    return prisma.user.delete({ where: { id: userId } });
  },

  // async getPendingInfluencers({ page, limit }: TList) {
  //   const where = {
  //     role: EUserRole.USER,
  //     socials: {
  //       some: {},
  //     },
  //   };

  //   const influencers = await prisma.user.findMany({
  //     where,
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });

  //   const total = await prisma.user.count({
  //     where,
  //   });

  //   return {
  //     meta: {
  //       pagination: {
  //         page,
  //         limit,
  //         total,
  //         totalPages: Math.ceil(total / limit),
  //       } as TPagination,
  //     },
  //     influencers,
  //   };
  // },
};
