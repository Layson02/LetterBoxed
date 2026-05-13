#!/bin/bash

NAME=$1

if [ -z "$NAME" ]; then
  echo "nome da migration é obrigatório"
  exit 1
fi

npx sequelize-cli migration:generate --name "$NAME"


LATEST=$(ls src/js/migrations/*.js 2>/dev/null | sort | tail -1)

if [ -n "$LATEST" ]; then
  NEW="${LATEST%.js}.cjs"
  mv "$LATEST" "$NEW"
  echo " Migration criada: $NEW"
fi