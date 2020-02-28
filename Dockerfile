FROM node:lts-alpine

RUN npm install -g history-server

WORKDIR /app

COPY ./packages/app/dist .

EXPOSE 8080
CMD [ "history-server", "./" ]
