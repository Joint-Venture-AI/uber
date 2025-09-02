import colors from 'colors';
import { errorLogger } from '../../../util/logger/logger';
import { logger } from '../../../util/logger/logger';
import config from '../../../config';
import prisma from '../../../util/prisma';

export const AdminServices = {
  /**
   * Seeds the admin user if it doesn't exist in the database
   *
   * This function checks if an admin user already exists in the database.
   * If an admin user exists, it returns without creating a new one.
   * Otherwise, it creates a new admin user with the provided admin data.
   */
  async seed() {
    const { name, email, password } = config.admin;

    try {
      const admin = await prisma.user.findFirst({
        where: { email },
      });

      if (admin?.is_admin && admin?.is_active && admin?.is_verified) return;

      logger.info(colors.green('🔑 admin creation started...'));

      if (admin) {
        await prisma.user.update({
          where: {
            id: admin.id,
          },
          data: {
            is_active: true,
            is_verified: true,
            is_admin: true,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            name,
            email,
            password: await password?.hash(),
            avatar: config.server.default_avatar,

            is_active: true,
            is_verified: true,
            is_admin: true,
          },
        });
      }

      logger.info(colors.green('✔ admin created successfully!'));
    } catch (error) {
      errorLogger.error(colors.red('❌ admin creation failed!'), error);
    }
  },
};
