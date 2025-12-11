FROM nginx:stable

WORKDIR /app
COPY . /app

RUN rm -rf /usr/share/nginx/html/index.html && \
  mv /app/dist/* /usr/share/nginx/html/ && \
  echo "deploy completed"
