import catchAsync from '../../middlewares/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ContextPageServices } from './ContextPage.service';
import { notFoundError } from '../../../errors';

export const ContextPageControllers = {
  modify: catchAsync(async ({ body }, res) => {
    const data = await ContextPageServices.modify(body);

    serveResponse(res, {
      message: `${body.pageName} updated successfully!`,
      data,
    });
  }),

  getPageNames: catchAsync(async (_, res) => {
    const data = await ContextPageServices.getPageNames();

    serveResponse(res, {
      message: 'Context Page retrieved successfully!',
      data: data.map(({ pageName }) => pageName),
    });
  }),

  getPage: catchAsync(async ({ params, originalUrl }, res) => {
    const data = await ContextPageServices.getPage(params.pageName);

    if (!data) throw notFoundError(originalUrl);

    serveResponse(res, {
      message: `${params.pageName} retrieved successfully!`,
      data: data.content,
    });
  }),
};
