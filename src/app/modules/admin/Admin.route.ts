import { Router } from 'express';
import { UserRoutes } from '../user/User.route';
import { ContextPageRoutes } from '../contextPage/ContextPage.route';

export default Router().inject([
  {
    path: '/users',
    route: UserRoutes.admin,
  },
  {
    path: '/context-pages',
    route: ContextPageRoutes.admin,
  },
]);
