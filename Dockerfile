FROM node:10.15.0

COPY package.json package-lock.json ./

RUN npm ci --production

COPY config config
COPY src src

EXPOSE 80
CMD ["node", "src/app"]
