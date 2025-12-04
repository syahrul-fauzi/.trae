FROM node:18-alpine
WORKDIR /service
COPY package.json .
RUN npm i --only=production || true
COPY . .
CMD ["node", "dist/index.js"]
