# Étape 1 : Build React
FROM node:22.17.0-alpine AS build

WORKDIR /app

# Copier uniquement package.json et package-lock.json
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du code du frontend
COPY . ./
RUN npm run build

# Étape 2 : Serve via nginx
FROM nginx:alpine

# Copier le build React vers nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copier configuration nginx si nécessaire (optionnel)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
