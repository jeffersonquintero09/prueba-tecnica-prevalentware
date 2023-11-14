// Importaciones de módulos y bibliotecas necesarias para configurar el servidor Apollo.
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './graphql/typeDef.js';
import { handleError, AuthenticationError } from './graphql/resolvers/errorHandling.js';
// Importaciones de los resolvers de GraphQL.
import userResolvers from './graphql/resolvers/userResolvers.js';
import countryResolvers from './graphql/resolvers/countryResolvers.js';
import userMonitoringResolvers from './graphql/resolvers/userMonitoringResolvers.js';
// Instancia de PrismaClient para interactuar con la base de datos.
const prisma = new PrismaClient();
// Agregación de todos los resolvers en un objeto único.
const resolvers = {
    ...userResolvers,
    ...countryResolvers,
    ...userMonitoringResolvers,
};
// Creación del esquema ejecutable de GraphQL con los type definitions y resolvers.
const schema = makeExecutableSchema({ typeDefs, resolvers });
// Configuración del servidor Apollo con el esquema y contextos adicionales.
const server = new ApolloServer({
    schema,
    // Aquí se pueden añadir configuraciones adicionales como plugins, cors, etc.
});
// Inicialización del servidor Apollo de forma independiente.
// Define el puerto de escucha del servidor, ya sea desde las variables de entorno o un valor por defecto.
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
// Función para iniciar el servidor y configurar el contexto de cada solicitud.
startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
        // Extracción del token de autorización de los encabezados de la solicitud.
        const token = req.headers.authorization || '';
        // Manejo de contexto para cada solicitud al servidor GraphQL.
        try {
            // Intenta encontrar una sesión válida usando el token proporcionado.
            const session = await prisma.session.findUnique({
                where: { sessionToken: token },
                include: { user: true },
            });
            // Verifica si la sesión existe y si aún no ha expirado.
            if (!session || new Date() > session.expiresAt) {
                // Lanza un error de autenticación si no hay sesión o si ha expirado.
                throw new AuthenticationError('Invalid or expired token');
            }
            // Si el token es válido, retorna el usuario y el cliente de Prisma en el contexto para su uso en los resolvers.
            return { user: session.user, prisma };
        }
        catch (error) {
            // Utiliza el manejo de errores personalizado para procesar y registrar el error.
            handleError(error);
            // Relanza el error para que sea manejado por Apollo Server.
            throw error;
        }
    },
}).then(({ url }) => {
    // Notifica en la consola que el servidor está listo y muestra la URL.
    console.log(`🚀 Server ready at ${url}`);
});
