import { PrismaClient } from '@prisma/client';
import { handleError } from './errorHandling.js';
import { applyPagination } from '../../utils.js';

// Definir una interfaz para los resultados de UserMonitoringCount
interface UserMonitoringCount {
  userId: string;
  monitoringCount: number;
}

// Definir una interfaz para los resultados de UserMonitoringUsage
interface UserMonitoringUsage {
  userId: string;
  usageCount: number;
}

const prisma = new PrismaClient();

const userMonitoringResolvers = {
  Query: {
    /**
     * Obtiene el monitoreo de un usuario por correo electrónico dentro de un rango de fechas.
     * Restringido para que los usuarios solo puedan ver su propio monitoreo, y los administradores puedan ver cualquier monitoreo.
     * Los managers no tienen acceso a esta información.
     */
    getUserMonitoringByUserAndDate: async (_, { email, startDate, endDate, page = 1, pageSize = 10 }, context) => {
      try {
        // Restricción basada en el rol del usuario.
        if (context.user.role.name !== 'Admin' && context.user.email !== email) {
          throw new Error('No tienes permiso para acceder a estos datos.');
        }
        // Los managers no pueden acceder a UserMonitoring.
        if (context.user.role.name === 'Manager') {
          throw new Error('No tienes permiso para realizar esta acción');
        }
        const paginationParams = applyPagination(page, pageSize);

        // Consulta condicionada por permisos del usuario.
        return await prisma.userMonitoring.findMany({
          where: {
            user: { email },
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          ...paginationParams,
        });
      } catch (error) {
        handleError(error);
        throw new Error('Error al recuperar el monitoreo del usuario por fecha');
      }
    },

    /**
     * Obtiene los tres usuarios con más registros en UserMonitoring dentro de un rango de tiempo.
     * Exclusivo para administradores.
     */
    getTopUsersByMonitoringCount: async (_, { startDate, endDate }, context) => {
      try {
        // Restricción basada en el rol del usuario.
        if (context.user.role.name !== 'Admin') {
          throw new Error('No tienes permiso para acceder a estos datos.');
        }

        // Realiza la consulta cruda y mapea los resultados al tipo esperado.
        const users: UserMonitoringCount[] = await prisma.$queryRaw`
          SELECT "userId", COUNT(*) as "monitoringCount"
          FROM "UserMonitoring"
          WHERE "createdAt" >= ${startDate} AND "createdAt" <= ${endDate}
          GROUP BY "userId"
          ORDER BY "monitoringCount" DESC
          LIMIT 3
        `;

        return users.map(user => ({
          userId: user.userId,
          monitoringCount: user.monitoringCount,
        }));
      } catch (error) {
        handleError(error);
        throw new Error('Error al recuperar los tres usuarios principales por recuento de monitoreo');
      }
    },

    /**
     * Obtiene los tres usuarios principales por un tipo específico de uso, en un país específico y dentro de un rango de tiempo.
     * Exclusivo para administradores.
     */
    getTopUsersByUsageAndCountry: async (_, { usage, countryId, startDate, endDate }, context) => {
      try {
        // Restricción basada en el rol del usuario.
        if (context.user.role.name !== 'Admin') {
          throw new Error('No tienes permiso para acceder a estos datos.');
        }

        // Realiza la consulta cruda y mapea los resultados al tipo esperado.
        const users: UserMonitoringUsage[] = await prisma.$queryRaw`
          SELECT u."userId", COUNT(*) as "usageCount"
          FROM "UserMonitoring" um
          INNER JOIN "User" u ON um."userId" = u.id
          INNER JOIN "_CountryToUser" c2u ON u.id = c2u."A"
          WHERE um."usage" = ${usage} AND c2u."B" = ${countryId} 
          AND um."createdAt" >= ${startDate} AND um."createdAt" <= ${endDate}
          GROUP BY u."userId"
          ORDER BY "usageCount" DESC
          LIMIT 3
        `;

        return users.map(user => ({
          userId: user.userId,
          usageCount: user.usageCount
        }));
      } catch (error) {
        handleError(error);
        throw new Error('Error al recuperar los tres usuarios principales por tipo de uso y país');
      }
    },
  },
};

export default userMonitoringResolvers;
