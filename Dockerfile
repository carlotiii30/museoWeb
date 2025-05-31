FROM node:23-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

COPY *.mjs ./
COPY swagger.js ./
COPY views views
COPY routes routes
COPY public public
COPY prisma prisma

RUN npx prisma generate

ENV NODE_ENV=production
ENV IN=production
EXPOSE 8000

CMD ["node", "index.mjs"]
