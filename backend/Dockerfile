FROM node:16

RUN mkdir /usr/app
WORKDIR /usr/app


# Install dependencies
COPY package.json .

RUN yarn install


COPY .env.production .env
COPY . .

ENV NODE_ENV=production


EXPOSE 8000
CMD ["yarn", "run", "backend"]
