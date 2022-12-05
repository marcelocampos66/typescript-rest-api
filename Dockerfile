FROM node:16.13.0

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001:3001

CMD ["npm", "start"]
