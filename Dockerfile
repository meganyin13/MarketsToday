FROM node:8

WORKDIR usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3115

CMD ["npm", "start"]