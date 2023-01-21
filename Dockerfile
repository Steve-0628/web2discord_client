FROM node:18.13.0-bullseye

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

ADD . .

RUN yarn build

CMD ["yarn", "start"]