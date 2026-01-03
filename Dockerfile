# Multi-stage build for Auth Service
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY src/ ./src/

FROM node:18-alpine AS runtime

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S auth-service -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=auth-service:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=auth-service:nodejs /app/src ./src
COPY --chown=auth-service:nodejs package*.json ./

USER auth-service

EXPOSE 3000

CMD ["node", "src/index.js"]