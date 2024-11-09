FROM nginx:1.27.2-alpine

WORKDIR /usr/share/nginx/html

COPY www/browser .
COPY nginx.conf /etc/nginx/nginx.conf

CMD  envsubst < assets/env.template.js > assets/env.js && nginx -g "daemon off;"

