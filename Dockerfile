FROM node:23-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala todas las dependencias (producción y dev si las hay)
RUN npm install

# Copia el resto del código
COPY . .

# Expón el puerto (opcional, para Fly.io logs/debug)
EXPOSE 3000

# Comando de arranque
CMD ["node", "src/index.js"]
