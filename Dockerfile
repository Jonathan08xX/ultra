FROM node:alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=production /usr/src/app/dist ./dist

CMD ["node", "dist/main"]