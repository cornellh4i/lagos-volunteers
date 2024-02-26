FROM node:16

RUN mkdir /usr/app
WORKDIR /usr/app


COPY . .
COPY .env.production .env

ENV NODE_ENV=production
RUN yarn install --production


EXPOSE 8000
CMD ["yarn", "run", "backend"]
