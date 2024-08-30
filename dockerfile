# Usa una imagen base de Node.js 20
FROM node:20-slim

# Instala las dependencias necesarias para Puppeteer
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Crea un usuario no root y usa ese usuario
RUN useradd -m -s /bin/bash appuser
USER appuser

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración de Node.js y realiza la instalación de dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Define el comando por defecto para ejecutar tu aplicación
CMD [ "node", "index.js" ]
