# Dockerfile for NextJs Frontend in dev mode

FROM node:16-alpine

WORKDIR /app

COPY yarn.lock .
COPY package.json ./
COPY package-lock.json .

RUN yarn install

# copy source code into working directory
COPY . ./

EXPOSE 3000

CMD ["yarn", "dev"]