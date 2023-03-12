# Currently is used for development only. Production images will use multi-stage builds.

FROM node:16
ENV NODE_ENV=production

RUN mkdir /usr/app
WORKDIR /usr/app

COPY yarn.lock .
COPY package.json .
COPY prisma ./prisma/

COPY .env ./

COPY . .

RUN yarn install --only=production
RUN npx prisma generate

EXPOSE 8000
CMD ["yarn", "backend"]
