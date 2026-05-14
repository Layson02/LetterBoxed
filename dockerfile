FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN chmod +x start.sh && sed -i 's/\r$//' start.sh src/js/scripts/migrate.sh || true

EXPOSE 3000

CMD ["./start.sh"]