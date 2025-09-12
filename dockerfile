# Usar imagen base de Node.js
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY ./src ./src

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001

# Cambiar propietario de archivos
RUN chown -R nodeapp:nodejs /app
USER nodeapp

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV PORT=3000
ENV NODE_ENV=production

# Comando de inicio
CMD ["npm", "start"]