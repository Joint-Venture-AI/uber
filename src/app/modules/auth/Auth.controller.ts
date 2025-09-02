import { AuthServices } from './Auth.service';
import catchAsync from '../../middlewares/catchAsync';
import serveResponse from '../../../util/server/serveResponse';

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

  accountVerify: catchAsync(async ({ body }, res) => {
    const user = await AuthServices.accountVerify(body);

    const { access_token, refresh_token } = AuthServices.retrieveToken(
      user.id!,
      'access_token',
      'refresh_token',
    );

    serveResponse(res, {
      message: 'Account verified successfully!',
      data: { user, access_token, refresh_token },
    });
  }),

  /*

  
  resetPassword: catchAsync(async ({ user }, res) => {
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

  changePassword: catchAsync(async (_, res) => {
    serveResponse(res, {
      message: 'Password changed successfully!',
    });
  }),

  */
};
