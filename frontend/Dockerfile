FROM node:16 as build-stage

WORKDIR /frontend

COPY . .

RUN yarn -i && yarn run build

# -------

FROM nginx:alpine

RUN apk add moreutils

WORKDIR /usr/share/nginx/html

# Remove default nginx config + assets
RUN rm -rf ./*
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build-stage /frontend/build .

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]