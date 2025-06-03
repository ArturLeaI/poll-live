# Etapa 1 - Build
FROM node:24.1.0 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2 - Desenvolvimento
FROM node:24.1.0

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
