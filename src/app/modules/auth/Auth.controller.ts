import { AuthServices } from './Auth.service';
import catchAsync from '../../middlewares/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import prisma from '../../../util/prisma';
import { EUserRole } from '../../../../prisma';

export const AuthControllers = {
  login: catchAsync(async ({ body }, res) => {
    const user = await AuthServices.login(body);

    const { access_token, refresh_token } = AuthServices.retrieveToken(
      user.id!,
      'access_token',
      'refresh_token',
    );

    serveResponse(res, {
      message: 'Login successfully!',
      data: { access_token, refresh_token, user },
    });
  }),

  resetPassword: catchAsync(async ({ body, user }, res) => {
    const { access_token, refresh_token } = AuthServices.retrieveToken(
      user.id,
      'access_token',
      'refresh_token',
    );

    serveResponse(res, {
      message: 'Password reset successfully!',
      data: { access_token, refresh_token, user },
    });
  }),

  refreshToken: catchAsync(async ({ user }, res) => {
    const { access_token } = AuthServices.retrieveToken(
      user.id,
      'access_token',
    );

    serveResponse(res, {
      message: 'AccessToken refreshed successfully!',
      data: { access_token },
    });
  }),

  changePassword: catchAsync(async ({ user, body }, res) => {
    serveResponse(res, {
      message: 'Password changed successfully!',
    });
  }),

  verifyAccount: catchAsync(async ({ user }, res) => {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: EUserRole.USER,
      },
    });

    serveResponse(res, {
      message: 'Account verified successfully!',
      data: { user },
    });
  }),
};
