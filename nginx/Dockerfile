FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/default.conf

# Default PORT
EXPOSE 80
# SSL PORT
EXPOSE 443