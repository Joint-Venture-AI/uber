/* eslint-disable no-unused-vars */
import { $ZodIssue } from 'zod/v4/core/errors.cjs';
import { User as TUser } from '../../../../prisma';
import { TUserLogin } from './Auth.interface';
import { encodeToken, TToken, verifyPassword } from './Auth.utils';
import { ZodError } from 'zod';
import prisma from '../../../util/prisma';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const AuthServices = {
  async login({ password, email, phone }: TUserLogin): Promise<Partial<TUser>> {
    //! if email or phone is missing then throw error
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
};
