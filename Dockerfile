FROM node:20-alpine AS build

WORKDIR /home/node/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build --omit=dev

FROM nginx:1.27.2-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /home/node/app/dist/e-commerce-frontend/browser .

COPY nginx.conf /etc/nginx/nginx.conf

RUN cp assets/env.template.js assets/env.js

EXPOSE 80

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
