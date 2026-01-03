# Multi-stage build for Auth Service
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY api/ ./api/

# Build the application (if needed)
# RUN npm run build

FROM node:18-alpine AS runtime

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S auth-service -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=auth-service:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=auth-service:nodejs /app/src ./src
COPY --from=builder --chown=auth-service:nodejs /app/api ./api
COPY --chown=auth-service:nodejs package*.json ./

# Create basic Node.js server if src doesn't exist
RUN if [ ! -f src/index.js ]; then \
    mkdir -p src && \
    echo 'const express = require("express"); \
const app = express(); \
const PORT = process.env.PORT || 8080; \
\
app.get("/health", (req, res) => res.json({ status: "healthy", service: "auth-service" })); \
app.get("/ready", (req, res) => res.json({ status: "ready", service: "auth-service" })); \
app.get("/", (req, res) => res.json({ message: "Auth Service", version: process.env.VERSION || "dev" })); \
\
app.listen(PORT, () => console.log(`Auth service listening on port ${PORT}`));' > src/index.js; \
fi

# Install express if package.json doesn't exist
RUN if [ ! -f package.json ]; then \
    npm init -y && \
    npm install express; \
fi

USER auth-service

EXPOSE 8080

CMD ["node", "src/index.js"]