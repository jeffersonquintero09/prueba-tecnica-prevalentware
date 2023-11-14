import gql from 'graphql-tag';

const typeDefs = gql`
  # Representa un usuario en el sistema
    type User {
    id: ID!
    email: String!
    countries: [Country!]! # Los países asociados al usuario
    userMonitorings: [UserMonitoring!]! # Monitoreo de actividad del usuario
    role: Role # Rol del usuario en el sistema, puede ser nulo
    }

    # Registra las actividades de los usuarios para su monitoreo
    type UserMonitoring {
    id: ID!
    description: String! # Descripción de la actividad realizada por el usuario
    createdAt: DateTime! # Fecha y hora de la actividad
    user: User! # Usuario que realizó la actividad
    }

    # Representa un país en el sistema
    type Country {
    id: ID!
    name: String! # Nombre del país
    users: [User!]! # Usuarios asociados a este país
    }

    # Define los roles de usuario en el sistema
    type Role {
    id: ID!
    name: String! # Nombre del rol
    users: [User!]! # Usuarios que tienen este rol
    }

    # Maneja la sesión de usuario para la autenticación
    type Session {
    id: ID!
    token: String! # Token de la sesión
    user: User! # Usuario asociado a la sesión
    expiresAt: DateTime! # Fecha y hora de expiración de la sesión
    }

    # Queries disponibles en el sistema
    type Query {
    getUserByEmail(email: String!): User # Obtiene un usuario por su correo electrónico
    getAllUsers(page: Int, pageSize: Int): [User] # Obtiene todos los usuarios con paginación opcional
    getAllCountries(page: Int, pageSize: Int): [Country] # Obtiene todos los países con paginación opcional
    getUserMonitoringByUserAndDate(
        email: String!
        startDate: DateTime!
        endDate: DateTime!
        page: Int
        pageSize: Int
    ): [UserMonitoring] # Obtiene el monitoreo de un usuario en un rango de fechas con paginación opcional
    getTopUsersByMonitoringCount(startDate: DateTime!, endDate: DateTime!): [UserMonitoringCount] # Obtiene los usuarios con mayor número de actividades registradas
    getTopUsersByUsageAndCountry(
        usage: Int!
        countryId: ID!
        startDate: DateTime!
        endDate: DateTime!
    ): [UserMonitoringUsage] # Obtiene los principales usuarios por tipo de uso y país
    }

    # Mutaciones (si son necesarias, definirlas aquí)

    # Tipo escalar para manejar fechas y horas
    scalar DateTime

    # Tipos adicionales para las consultas agregadas
    type UserMonitoringCount {
    userId: ID!
    monitoringCount: Int!
    }

    type UserMonitoringUsage {
    userId: ID!
    usageCount: Int!
    }

`;

export default typeDefs;