FROM node:20-bookworm AS base

# Dockerfile uses multi-stage builds to reduce the size of the image
FROM base AS deps

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \ 
    g++ 

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Skip configuration validation while building
ENV SKIP_ENV_VALIDATION true

RUN npm run postinstall

# Set the DATABASE_URL to tell the installation where the database is
ENV DATABASE_URL file:./db.sqlite

# Create and seed the database
RUN npm run db:push

RUN npm run db:seed

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --home /home/nextjs --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/prisma/db.sqlite ./prisma/

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV IMAGE_UPLOAD_DIR=/images
RUN mkdir /images && chown nextjs:nodejs /images
VOLUME /images

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]