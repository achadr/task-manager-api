# ---------- étape 1 : construction ----------
FROM node:24-slim AS builder
WORKDIR /app
# NON VÉRIFIÉ : la CLI Prisma aurait besoin de libssl sur une image slim.
# On le garde pour l'instant, le test de migration de la partie 5 tranchera.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc
RUN mkdir -p /app/data && chown -R node:node /app/data

# ---------- étape 2 : exécution ----------
FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
EXPOSE 3000
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node
CMD ["node", "dist/index.js"]