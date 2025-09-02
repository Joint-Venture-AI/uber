/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import { decodeToken, TToken } from '../modules/auth/Auth.utils';
import catchAsync from './catchAsync';
import prisma from '../../util/prisma';
import { EUserRole, User as TUser } from '../../../prisma';

/**
 * Middleware to authenticate and authorize requests based on user roles
 *
 * @param roles - The roles that are allowed to access the resource
 */
const auth = ({
  token_type = 'access_token',
  validator = () => void 0,
}: {
  token_type?: TToken;
  validator?: (user: TUser) => void;
} = {}) =>
  catchAsync(async (req, _, next) => {
    const token =
      // req.cookies[token_type] ||
      req.headers.authorization || req.query[token_type];

    const id = decodeToken(token, token_type)?.uid;

    if (!id)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'Your session has expired. Login again.',
      );

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'Maybe your account has been deleted. Register again.',
      );

    validator(user);

    req.user = user;

    next();
  });

auth.admin = auth({
  validator(user) {
    if (!user.is_admin) {
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not an admin');
    }
  },
});

auth.user = auth({
  validator({ is_verified, is_active, role, is_admin }) {
    if (is_admin) return;

    if (!is_verified) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You account are not verified',
      );
    } else if (!is_active) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You account are not active',
      );
    } else if (role !== EUserRole.USER) {
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not a user');
    }
  },
});

auth.driver = auth({
  validator({ is_verified, is_active, role, is_admin }) {
    if (is_admin) return;

    if (!is_verified) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You account are not verified',
      );
    } else if (!is_active) {
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'You account are not active',
      );
    } else if (role !== EUserRole.DRIVER) {
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not a driver');
    }
  },
});

//! Token Verification
auth.refresh_token = auth({ token_type: 'refresh_token' });

export default auth;
