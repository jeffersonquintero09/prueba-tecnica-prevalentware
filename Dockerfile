# Etapa de construcción: Utiliza una versión completa de Node.js para construir la aplicación.
FROM node:20 AS builder

# Define el directorio de trabajo en el contenedor.
WORKDIR /usr/src/app

# Copia los archivos de definición de paquetes de Node.js en el contenedor.
COPY package*.json ./

# Instala las dependencias de Node.js sin ejecutar scripts.
RUN npm ci --only=production

# Copia el resto de los archivos del proyecto en el contenedor.
COPY . .

# Etapa de ejecución: Utiliza una versión slim de Node.js para reducir el tamaño de la imagen.
FROM node:20-slim

# Define el directorio de trabajo en el contenedor.
WORKDIR /usr/src/app

# Copia los archivos construidos desde la etapa de construcción al contenedor actual.
COPY --from=builder /usr/src/app .

# Instala OpenSSL para la compatibilidad de Prisma con Debian
USER root
RUN apt-get update -y && apt-get install -y openssl

# Cambia al usuario no privilegiado 'node' para seguridad.
USER node

# Expone el puerto 4000, que es el puerto por defecto de la aplicación.
EXPOSE 4000

# Ejecuta el comando para iniciar la aplicación.
CMD ["npm", "start"]
