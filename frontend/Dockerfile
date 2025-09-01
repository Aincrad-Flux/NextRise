FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# ---------- Development ----------
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- Build (production) ----------
FROM base AS build
RUN npm run build

# ---------- Production (static, nginx) ----------
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
