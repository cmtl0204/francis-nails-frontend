# ---- BUILD ----
FROM node:20.19.0-bullseye-slim AS build
WORKDIR /app
ENV CI=true npm_config_fund=false npm_config_audit=false
COPY package*.json ./
RUN npm install --package-lock-only
RUN npm ci
COPY . .
RUN npm run build:prod

# ---- RUNTIME ----
FROM nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# ⚠️ Cambia la ruta si tu outputPath es otro
COPY --from=build /app/dist/francis-nails-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
