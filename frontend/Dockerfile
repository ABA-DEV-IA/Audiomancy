# Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production && npm install -g cross-env
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]