# ETAPA 1: Build del frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos package.json primero para aprovechar la cache de Docker
COPY package.json package-lock.json* ./
RUN npm install

# Copiamos el código fuente y compilamos
COPY . .
RUN npm run build

# ETAPA 2: Servidor Nginx
FROM nginx:alpine

# Copiamos el build generado en la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto que expone Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]