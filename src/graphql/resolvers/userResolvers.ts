import { PrismaClient } from '@prisma/client';
import { handleError } from './errorHandling.js';
import { checkUserRole, applyPagination } from '../../utils.js';

// Inicializa PrismaClient para interactuar con la base de datos.
const prisma = new PrismaClient();

const userResolvers = {
  Query: {
    /**
     * Resolver para obtener un usuario específico por correo electrónico.
     * Restringe el acceso de acuerdo con el rol del usuario:
     * - Los usuarios con rol 'User' solo pueden obtener su propia información.
     * - Los usuarios con rol 'Admin' pueden obtener información de cualquier usuario.
     * - Los usuarios con rol 'Manager' no tienen acceso a este resolver.
     */
    getUserByEmail: async (_, { email }, context) => {
      try {
        // Verifica el rol y la correspondencia del correo electrónico.
        const canViewUserMonitoring = context.user.role.name === 'Admin' || context.user.email === email;
        if (!canViewUserMonitoring && context.user.role.name !== 'Manager') {
          throw new Error('No tienes permiso para acceder a estos datos.');
        }

        // Incluye las relaciones de acuerdo con los permisos del rol.
        return await prisma.user.findUnique({
          where: { email },
          include: {
            countries: true,
            userMonitoring: canViewUserMonitoring,
          },
        });
      } catch (error) {
        handleError(error);
        throw new Error('Error al recuperar el usuario por correo electrónico');
      }
    },
    
    /**
     * Resolver para obtener todos los usuarios con soporte de paginación.
     * - Los usuarios con rol 'Admin' tienen acceso completo.
     * - Los usuarios con rol 'Manager' pueden ver todos los usuarios, pero no su monitoreo.
     * - Los usuarios con rol 'User' no tienen acceso a este resolver.
     */
    getAllUsers: async (_, { page = 1, pageSize = 10 }, context) => {
      try {
        // Verifica el rol del usuario.
        if (context.user.role.name === 'User') {
          throw new Error('No tienes permiso para realizar esta acción');
        }

        // Aplica la paginación y las relaciones de acuerdo con los permisos del rol.
        const paginationParams = applyPagination(page, pageSize);
        return await prisma.user.findMany({
          ...paginationParams,
          include: {
            countries: true,
            userMonitoring: context.user.role.name === 'Admin',
          },
        });
      } catch (error) {
        handleError(error);
        throw new Error('Error al recuperar todos los usuarios');
      }
    },
  },
};

// Exporta los resolvers para su uso en Apollo Server.
export default userResolvers;
