#!/bin/sh
set -eu

BASTION_PROJECT_PATH="${BASTION_PROJECT_PATH:-$HOME/proyecto-node}"
DOCKER_PRIVATE_HOST="${DOCKER_PRIVATE_HOST:-10.0.2.3}"
DOCKER_PROJECT_PATH="${DOCKER_PROJECT_PATH:-/home/g2023171020/proyecto-node}"
NGINX_PRIVATE_HOST="${NGINX_PRIVATE_HOST:-10.0.1.3}"
DOCKER_USER="${DOCKER_USER:-g2023171020}"
NGINX_USER="${NGINX_USER:-g2023171020}"

echo "Sincronizando codigo al servidor Docker privado"
rsync -az --delete \
  --exclude ".git" \
  --exclude "backend/node_modules" \
  --exclude "frontend/node_modules" \
  "$BASTION_PROJECT_PATH"/ "$DOCKER_USER@$DOCKER_PRIVATE_HOST:$DOCKER_PROJECT_PATH"

echo "Levantando stack en servidor-docker-privado"
ssh "$DOCKER_USER@$DOCKER_PRIVATE_HOST" "
  set -eu
  cd '$DOCKER_PROJECT_PATH'
  docker compose -f docker-compose.gcp.yml up -d --build
"

echo "Publicando configuracion de Nginx"
scp "$BASTION_PROJECT_PATH/infra/nginx/gcp-servidor-nginx.conf" "$NGINX_USER@$NGINX_PRIVATE_HOST:/tmp/proyecto-node.conf"
ssh "$NGINX_USER@$NGINX_PRIVATE_HOST" "
  set -eu
  sudo mv /tmp/proyecto-node.conf /etc/nginx/conf.d/proyecto-node.conf
  sudo nginx -t
  sudo systemctl reload nginx
"

echo "Despliegue completado"
