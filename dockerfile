# Dockerfile
FROM node:18-bullseye-slim

# Instalar Python y pip
RUN apt-get update && apt-get install -y python3 python3-venv python3-pip

# Copiar archivos de la aplicación
WORKDIR /app

COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Instalar dependencias del sistema necesarias para Puppeteer y otros módulos
RUN apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    libgbm1 \
    libatk-bridge2.0-0 \
    libxshmfence-dev

# Crear y activar un entorno virtual de Python
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copiar y instalar dependencias de Python
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos de la aplicación
COPY . .

EXPOSE 8080

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Ejecutar todo como usuario no privilegiado
USER pptruser

# Ejecutar la aplicación
CMD ["node", "src/index.js"]
