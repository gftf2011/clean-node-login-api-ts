FROM node:lts-alpine

WORKDIR /app

COPY backend/email .

RUN npm i --silent

CMD npm run start:dev
