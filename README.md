# Prueba Técnica para la Posición de Ingeniero Backend

## Introducción

Este documento describe las instrucciones de configuración y despliegue para el servidor GraphQL desarrollado como parte de la prueba técnica para Ingeniero Backend en PrevalentWare. El servidor está diseñado para monitorear el comportamiento del usuario en una plataforma, registrar sus interacciones y asociarlas con diferentes países.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:
- Node.js (versión 20 o posterior)
- Docker y Docker Compose
- PostgreSQL (si se ejecuta localmente sin Docker)

## Primeros Pasos

Para poner en marcha la aplicación, sigue estos pasos:

### Configuración del Entorno

1. Clona el repositorio:
   ```bash
   git clone https://github.com/jeffersonquintero09/prueba-tecnica-prevalentware.git
   
2. Instalar dependencias:
   ```bash
   npm install

3. Configurar variables de entorno:
   - Crear un archivo .env en la raíz del proyecto.
   - Añadir las variables necesarias, como DATABASE_URL.

4. Ejecutar migraciones de la base de datos:
   ```bash
   npx prisma migrate deploy

5. Iniciar el servidor:
   ```bash
   npm start

### Configuración con Docker

1. Construir la imagen:
   ```bash
   docker build -t backend-server .

2. Ejecutar el contenedor:
   ```bash
   docker run -p 4000:4000 backend-server

## Justificación de Decisiones

- Node.js y Apollo Server: Proporcionan un entorno eficiente y escalable para servidores GraphQL.
- Prisma: Facilita la interacción con la base de datos y mejora la productividad con su ORM.
- Docker: Ofrece un despliegue consistente y aislado del entorno de ejecución.
- AWS Lambda vs. ECS: Lambda es ideal para aplicaciones con patrones de tráfico variables, mientras que ECS es más adecuado para cargas de trabajo predecibles y gestionar contenedores a escala.

## Propuesta de Despliegue en AWS

### AWS Lambda (Serverless):
- Ventajas: Ideal para aplicaciones con variabilidad en el tráfico. Escalabilidad automática y pago por uso.
- Despliegue:
   + Empaquetar la aplicación con dependencias usando herramientas como Serverless Framework o AWS SAM.
   + Configurar un API Gateway para exponer el servidor GraphQL.
   + Establecer roles IAM con los permisos necesarios.
   + Usar AWS Secrets Manager para manejar las variables de entorno sensibles.
   + Definir políticas de escalado y alarmas en CloudWatch.
   
### Amazon ECS (Docker Container Service):
- Ventajas: Adecuado para aplicaciones con tráfico predecible y necesidad de control sobre la gestión de contenedores.
- Despliegue:
   + Crear una imagen Docker y subirla a Amazon ECR.
   + Configurar un clúster de ECS con las especificaciones de CPU y memoria.
   + Crear una definición de servicio ECS con la imagen Docker y configurar la red y el balanceador de carga.
   + Definir la estrategia de despliegue (Rolling Update, Blue/Green, etc.).
   + Establecer políticas de Auto Scaling basadas en la utilización de recursos.
   + Integrar con Amazon RDS para la gestión de la base de datos PostgreSQL.
   + Utilizar AWS CloudFormation o Terraform para infraestructura como código y facilitar la replicación y el despliegue.
   
Para ambos casos, es crucial configurar un sistema de monitoreo y alertas con AWS CloudWatch y realizar pruebas de carga para asegurar que la aplicación puede manejar picos de tráfico inesperados. También, implementar una estrategia de CI/CD para automatizar el proceso de despliegue y pruebas.