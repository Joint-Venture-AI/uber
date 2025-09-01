import { ContextPage as TContextPage } from '../../../../prisma';
import prisma from '../../../util/prisma';

export const ContextPageServices = {
  async modify({ pageName, content }: TContextPage) {
    return prisma.contextPage.upsert({
      where: {
        pageName,
      },
      update: {
        content,
      },
      create: {
        pageName,
        content,
      },
    });
  },

  async getPage(pageName: string) {
    return prisma.contextPage.findFirst({
      where: {
        pageName: {
          equals: pageName,
          mode: 'insensitive',
        },
      },
    });
  },

  async getPageNames() {
    return prisma.contextPage.findMany({ select: { pageName: true } });
  },
};
