FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]