FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies separately for better caching
COPY package*.json ./
RUN npm install

COPY . .

# ---------- Development ----------
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- Build (production) ----------
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# ---------- Production runtime ----------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
