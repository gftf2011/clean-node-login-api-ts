FROM node:lts-alpine

WORKDIR /app

COPY backend/auth .

RUN npm i --silent

CMD npm run start:dev
