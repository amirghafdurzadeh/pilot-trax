FROM node:lts-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

CMD ["npx", "prisma", "migrate", "deploy"]
