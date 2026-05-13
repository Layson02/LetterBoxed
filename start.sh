#!/bin/sh

echo "Inciando Servidor..."

echo "Executando migrações..."
npm run migration:run 2>migration.log 


echo "Iniciando aplicação..."
npm start 2>server.log


echo "Servidor iniciado com sucesso!"
