# Lightweight Setup Node.js (Alpine)
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for node-gyp and Prisma
RUN apk add --no-cache python3 make g++ openssl

# Salin package.json dan package-lock.json jika ada
COPY package*.json ./

# Install dependensi (termasuk devDependencies) untuk proses Build
RUN npm ci

# Salin src dan config
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build frontend dan backend
RUN npm run build

# Menyiapkan production image yang ramping
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

# Set Env to Production
ENV NODE_ENV=production

# Install HANYA production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy folder build artifact (.dist dll)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
# Copy prisma (berguna untuk sinkronisasi db/migrate di start script atau pipeline)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/package.json ./

# Expose spesifik port
EXPOSE 3000

# Script run (Server harus memproses middleware static delivery dist dan API express)
# Kami asumsikan target start menunjuk `tsx server.ts` atau kompilasi sejenis
# Di Production nyata dapat diganti dengan process manager seperti `pm2`
CMD ["npm", "start"]
