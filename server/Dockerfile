FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY src/ ./src/

# Non-root user for security
RUN addgroup -S rently && adduser -S rently -G rently
USER rently

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/index.js"]
