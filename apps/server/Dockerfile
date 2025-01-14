FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Copy the server package.json
COPY apps/server/package.json ./apps/server/package.json

# Copy prisma schema and package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/database/prisma ./packages/database/prisma/

# Install dependencies
RUN yarn install

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

# Copy built assets
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Install production dependencies only
RUN yarn install --production

WORKDIR /app/apps/server

EXPOSE 8000

CMD ["yarn", "start"]