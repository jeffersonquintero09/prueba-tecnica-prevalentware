/**
 * Clase base para errores personalizados.
 * Extiende la clase nativa de Error para permitir el manejo de errores específicos de la aplicación.
 */
class CustomError extends Error {
    constructor(message) {
        super(message); // Llama al constructor de la clase Error.
        this.name = 'CustomError'; // Establece el nombre del error para identificación.
    }
}
/**
 * Clase para errores de validación.
 * Puede ser utilizada cuando los datos no pasan una validación de entrada esperada.
 */
class ValidationError extends CustomError {
    constructor(message) {
        super(message); // Llama al constructor de la clase CustomError.
        this.name = 'ValidationError'; // Establece el nombre del error para identificación.
    }
}
/**
 * Clase para errores de autenticación.
 * Útil para casos donde un usuario intenta realizar una acción sin las credenciales adecuadas.
 */
class AuthenticationError extends CustomError {
    constructor(message) {
        super(message); // Llama al constructor de la clase CustomError.
        this.name = 'AuthenticationError'; // Establece el nombre del error para identificación.
    }
}
/**
 * Función para manejar errores.
 * Imprime detalles del error en la consola y luego relanza el error.
 * Esto permite que los errores personalizados sean manejados de manera diferenciada a otros errores.
 * @param error - El error que se necesita manejar.
 */
const handleError = (error) => {
    if (error instanceof CustomError) {
        // Manejo específico para errores personalizados.
        console.error(`Custom Error - ${error.name}: ${error.message}`);
    }
    else {
        // Manejo general para cualquier otro tipo de Error no personalizado.
        console.error('Unhandled Error:', error);
    }
    // Relanza el error para que pueda ser manejado más arriba en la cadena de llamadas.
    throw error;
};
// Exporta las clases de errores para su uso en otros módulos.
export { CustomError, ValidationError, AuthenticationError, handleError };
