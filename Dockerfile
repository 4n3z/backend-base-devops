# Uso una imagen base oficial de Node.js
FROM node:18-alpine

# Establezco el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copio los archivos de la aplicación
COPY ./dist ./dist
COPY ./package.json .
COPY ./node_modules ./node_modules

# Comando para ejecutar la aplicación, se agrega la línea "start": "node dist/index.js", en el archivo package.json antes de la línea "test": "jest --coverage"
CMD ["npm", "start"]