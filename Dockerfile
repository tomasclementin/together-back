FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
