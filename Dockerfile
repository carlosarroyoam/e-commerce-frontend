# =========================
# Build stage
# =========================
FROM node:24-alpine AS build

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# =========================
# Runtime stage
# =========================
FROM nginx:1.31-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /home/node/app/dist/e-commerce-frontend/browser .

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
