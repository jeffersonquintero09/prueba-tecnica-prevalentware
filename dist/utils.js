/**
 * Crea un objeto con las propiedades de paginación para una consulta Prisma.
 * @param page - Página actual.
 * @param pageSize - Número de elementos por página.
 * @returns Un objeto con las propiedades de paginación.
 */
export const applyPagination = (page, pageSize) => {
    const offset = (page - 1) * pageSize;
    return {
        skip: offset,
        take: pageSize,
    };
};
/**
 * Verifica si el usuario tiene uno de los roles permitidos.
 * @param user - Objeto del usuario actual.
 * @param allowedRoles - Lista de roles permitidos.
 * @throws Si el usuario no tiene un rol permitido.
 */
export const checkUserRole = (user, allowedRoles) => {
    if (!user || !allowedRoles.includes(user.role.name)) {
        throw new Error("Acceso denegado: no tienes permiso para realizar esta acción");
    }
};
