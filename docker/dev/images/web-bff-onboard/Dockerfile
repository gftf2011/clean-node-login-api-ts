FROM node:lts-alpine

WORKDIR /app

COPY backend-for-frontend/web/onboard-bff .

RUN npm i --silent

CMD npm run start:dev
