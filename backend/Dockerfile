# Currently is used for development only. Production images will use multi-stage builds.

FROM node:16
ENV NODE_ENV=production

RUN mkdir /usr/app
WORKDIR /usr/app

COPY yarn.lock .
COPY package.json .
COPY prisma ./prisma/

COPY . .

RUN mkdir -p prisma/migrations/0_init
RUN npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql


RUN yarn install


COPY . .
EXPOSE 8000
RUN npx prisma generate
CMD ["yarn", "backend"]