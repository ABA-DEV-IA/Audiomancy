# Étape 1 : Builder l'application
FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

RUN npm install

# Copier le reste du code
COPY . .

# Builder l'application (Next/Vue)
RUN npm run build

# Étape 2 : Image finale légère pour production
FROM node:22-alpine

WORKDIR /app

# Copier les dépendances du builder
COPY package*.json ./
RUN npm install --production \
    && npm install -g cross-env

# Copier le build
COPY --from=builder /app/.next ./.next

# Exposer le port sur lequel Azure Web App va faire le ping
ENV PORT=8080
EXPOSE 8080

# Commande de démarrage
CMD ["npm", "start"]