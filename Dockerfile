FROM node:20.14-alpine3.20

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm ci

CMD [ "npm", "run", "start:dev" ]
