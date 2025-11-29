# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies and prisma CLI for migrations
RUN apk add --no-cache openssl
RUN npm install --only=production && npm install prisma

# Copy Prisma schema before generating client
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client in the production image
RUN npx prisma generate

# Copy built artifacts and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Create a directory for the database
RUN mkdir -p /app/data

# Expose the port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV DATABASE_URL="file:/app/data/dev.db"

# Start command with migration
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
