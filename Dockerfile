FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache python3 make g++

# Copy package management files
COPY package.json yarn.lock ./
COPY apps/server/package.json ./apps/server/
COPY packages/database/package.json ./packages/database/
COPY turbo.json ./

# Install dependencies without frozen lockfile first
RUN yarn install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN cd packages/database && npx prisma generate

# Build the server
WORKDIR /app/apps/server
RUN yarn build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

WORKDIR /app/apps/server

EXPOSE 8000

CMD ["node", "dist/index.js"]