FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Enable Corepack for Yarn
RUN corepack enable

# Copy root package files
COPY package.json .
COPY yarn.lock .
COPY turbo.json .

# Copy workspace package files
COPY apps/server/package.json ./apps/server/
COPY packages/database/package.json ./packages/database/

# Copy prisma files
COPY packages/database/prisma ./packages/database/prisma/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/server ./apps/server
COPY packages/database ./packages/database

# Generate Prisma Client
RUN cd packages/database && npx prisma generate

# Build the server
WORKDIR /app/apps/server
RUN yarn build

# Production image
FROM node:18-alpine

WORKDIR /app

# Enable Corepack for Yarn in production
RUN corepack enable

# Copy necessary files
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/apps/server/package.json ./apps/server/
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/server

EXPOSE 8000

CMD ["yarn", "start"]