/* eslint-disable no-unused-vars */
import { $ZodIssue } from 'zod/v4/core/errors.cjs';
import { User as TUser } from '../../../../prisma';
import { TAccountVerify, TUserLogin } from './Auth.interface';
import { encodeToken, TToken, verifyPassword } from './Auth.utils';
import { ZodError } from 'zod';
import prisma from '../../../util/prisma';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const AuthServices = {
  async login({ password, email, phone }: TUserLogin): Promise<Partial<TUser>> {
    this.validEmailORPhone({ email, phone });

    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
      omit: {
        otp: true,
        otp_expires_at: true,
      },
    });

    if (!user)
      throw new ServerError(StatusCodes.NOT_FOUND, "User doesn't exist");

    if (!(await verifyPassword(password, user.password))) {
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'Incorrect password');
    }

    Object.assign(user, { password: undefined });

    return user;
  },

  validEmailORPhone({ email, phone }: { email?: string; phone?: string }) {
    if (!email || !phone) {
      const issues: $ZodIssue[] = [];

      if (!email && !phone)
        issues.push({
          code: 'custom',
          path: ['email'],
          message: 'Email or phone is missing',
        });

      if (!phone && !email)
        issues.push({
          code: 'custom',
          path: ['phone'],
          message: 'Email or phone is missing',
        });

      if (issues.length) throw new ZodError(issues);
    }
  },

  /** this function returns an object of tokens
   * e.g. retrieveToken(userId, 'access_token', 'refresh_token');
   * returns { access_token, refresh_token }
   */
  retrieveToken<T extends readonly TToken[]>(uid: string, ...token_types: T) {
    return Object.fromEntries(
      token_types.map(token_type => [
        token_type,
        encodeToken({ uid }, token_type),
      ]),
    ) as Record<T[number], string>;
  },

  async accountVerify({ email, phone, otp }: TAccountVerify) {
    this.validEmailORPhone({ email, phone });

    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (!user)
      throw new ServerError(StatusCodes.NOT_FOUND, "User doesn't exist");

    if (user.otp !== otp)
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'Incorrect OTP');

    if (!user.otp_expires_at || user.otp_expires_at < new Date())
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'OTP has expired');

    return prisma.user.update({
      where: { id: user.id },
      data: {
        is_verified: true,
        otp: null,
        otp_expires_at: null,
      },
      omit: {
        password: true,
        otp: true,
        otp_expires_at: true,
      },
    });
  },
};
