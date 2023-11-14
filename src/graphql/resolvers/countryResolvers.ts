import { PrismaClient } from '@prisma/client';
import { handleError } from './errorHandling.js';
import { applyPagination, checkUserRole } from '../../utils.js';

// Se crea una instancia única de PrismaClient para interactuar con la base de datos.
const prisma = new PrismaClient();

const countryResolvers = {
  Query: {
    /**
     * Obtiene todos los países aplicando paginación.
     * Solo los usuarios con roles 'Admin' o 'Manager' tienen acceso a este query.
     * @param {object} _ - No se utiliza el objeto raíz en este resolver.
     * @param {object} args - Contiene argumentos para la paginación.
     * @param {object} context - Contiene información del usuario actual y su rol.
     * @returns {Promise<Array>} Promesa que resuelve en la lista de países.
     */
    getAllCountries: async (_, { page = 1, pageSize = 10 }, context) => {
      try {
        checkUserRole(context.user, ['Admin', 'Manager']);
        const paginationParams = applyPagination(page, pageSize);
        return await prisma.country.findMany({
          ...paginationParams,
        });
      } catch (error) {
        handleError(error);
        throw new Error('Error al recuperar todos los países');
      }
    },

    /**
     * Obtiene todos los países utilizando una consulta SQL cruda con paginación.
     * Solo los usuarios con roles 'Admin' o 'Manager' tienen acceso a este query.
     * @param {object} _ - No se utiliza el objeto raíz en este resolver.
     * @param {object} args - Contiene argumentos para la paginación.
     * @param {object} context - Contiene información del usuario actual y su rol.
     * @returns {Promise<Array>} Promesa que resuelve en la lista de países obtenidos por SQL crudo.
     */
    getCountryWithRawSQL: async (_, { page = 1, pageSize = 10 }, context) => {
      try {
        checkUserRole(context.user, ['Admin', 'Manager']);
        const paginationParams = applyPagination(page, pageSize);
        const countries = await prisma.$queryRaw`SELECT * FROM "Country" LIMIT ${pageSize} OFFSET ${paginationParams.skip}`;
        return countries;
      } catch (error) {
        handleError(error);
        throw new Error('Error al recuperar todos los países usando SQL crudo');
      }
    },
  },
};

export default countryResolvers;
