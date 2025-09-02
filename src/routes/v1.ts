import { Router } from 'express';
import auth from '../app/middlewares/auth';
import AdminRoutes from '../app/modules/admin/Admin.route';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { StatusCodes } from 'http-status-codes';
import { ContextPageRoutes } from '../app/modules/contextPage/ContextPage.route';
import { fileTypes } from '../app/middlewares/capture';

const appRouter = Router();

/** Forward uploaded files requests */
fileTypes.map((filetype: string) =>
  appRouter.get(`/${filetype}/:filename`, (req, res) =>
    res.redirect(
      StatusCodes.MOVED_PERMANENTLY,
      `/${filetype}/${encodeURIComponent(req.params.filename)}`,
    ),
  ),
);

export default appRouter.inject([
  {
    path: '/context-pages',
    route: ContextPageRoutes.user,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    route: UserRoutes.user,
  },
  {
    path: '/admin',
    middlewares: [auth.admin],
    route: AdminRoutes,
  },
]);
