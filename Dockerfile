# Usa exactamente Node 20.19.0
FROM node:20.19.0-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar manifiestos primero para aprovechar la cache
COPY package*.json ./

# Instalar dependencias de prod
# (si no tienes package-lock.json, cambia a `npm install --omit=dev`)
RUN npm ci --omit=dev

# Copiar el resto del proyecto
COPY . .

# Puerto de la app (la app debe escuchar en process.env.PORT)
ENV PORT=5000
EXPOSE 5000

# Comando de arranque
CMD ["node", "src/server.js"]

