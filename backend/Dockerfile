# Currently is used for development only. Production images will use multi-stage builds.

FROM node:16

RUN mkdir /usr/app
WORKDIR /usr/app

COPY yarn.lock .
COPY package.json .
COPY prisma ./prisma/

RUN yarn install

COPY . .
EXPOSE 8000
RUN npx prisma generate
CMD ["yarn", "backend"]
