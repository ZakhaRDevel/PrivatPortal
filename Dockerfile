FROM node:16 AS builder

ARG BUILD_APP_ENV=production
ENV APP_ENV=$BUILD_APP_ENV

COPY ./ /usr/src/app/

RUN cd /usr/src/app && \
    npm config set unsafe-perm true && \
    npm install && \
    npm run build

FROM nginx:alpine

COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/pvtclub-portal/browser /app/

CMD ["nginx", "-g", "daemon off;"]
