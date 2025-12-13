# Multi-stage Dockerfile for Next.js + Prisma application
# Uses Debian-based Node images for Prisma compatibility

### Builder stage
FROM node:20-bullseye as builder
WORKDIR /app

# Install dependencies (prefer lockfile if present)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-optional --prefer-offline; else npm install; fi

# Copy source
COPY . .

# Generate Prisma client (if Prisma is used)
RUN if [ -d prisma ] || grep -q "prisma" package.json; then npx prisma generate || true; fi

# Build the Next.js app
RUN npm run build

### Production stage
FROM node:20-bullseye-slim
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
