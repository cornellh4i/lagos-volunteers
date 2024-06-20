FROM node:18

WORKDIR /app
COPY backend/package.json . backend/yarn.lock ./
COPY backend/prisma ./prisma
COPY backend/.env.production .env

RUN yarn install 
RUN npx prisma generate
COPY . .

ENV NODE_ENV=production

EXPOSE 8000
CMD ["yarn", "run", "backend"]
