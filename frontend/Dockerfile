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
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
