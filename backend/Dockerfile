FROM node:18

WORKDIR /app
COPY package.json . yarn.lock ./
COPY prisma ./prisma
COPY .env.production .env

RUN yarn install 
RUN npx prisma generate
COPY . .


ENV NODE_ENV=production

EXPOSE 8000
CMD ["yarn", "run", "backend"]
