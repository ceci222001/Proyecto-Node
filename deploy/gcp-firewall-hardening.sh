#!/bin/sh
set -eu

PROJECT_ID="${PROJECT_ID:-infraestructura-segura}"
NETWORK="${NETWORK:-default}"
NGINX_TAG="${NGINX_TAG:-nginx}"
BASTION_TAG="${BASTION_TAG:-bastion}"
DOCKER_TAG="${DOCKER_TAG:-docker-privado}"

echo "Creando reglas privadas para trafico entre Nginx y servidor Docker"
gcloud compute firewall-rules create allow-docker-private-from-nginx \
  --project="$PROJECT_ID" \
  --network="$NETWORK" \
  --direction=INGRESS \
  --action=ALLOW \
  --rules=tcp:5000,tcp:8080,tcp:3001,tcp:3002,tcp:9090,tcp:9000 \
  --source-ranges=10.0.1.3/32 \
  --target-tags="$DOCKER_TAG" || true

echo "Creando regla SSH privada desde bastion"
gcloud compute firewall-rules create allow-ssh-from-bastion \
  --project="$PROJECT_ID" \
  --network="$NETWORK" \
  --direction=INGRESS \
  --action=ALLOW \
  --rules=tcp:22 \
  --source-ranges=10.0.1.2/32 \
  --target-tags="$DOCKER_TAG","$NGINX_TAG" || true

echo "Asegura que solo Nginx siga expuesto por HTTP"
gcloud compute firewall-rules create allow-http-nginx-public \
  --project="$PROJECT_ID" \
  --network="$NETWORK" \
  --direction=INGRESS \
  --action=ALLOW \
  --rules=tcp:80 \
  --source-ranges=0.0.0.0/0 \
  --target-tags="$NGINX_TAG" || true

echo "Elimina o deshabilita reglas publicas antiguas si ya no se usan:"
echo "allow-monitoreo allow-monitoreo-2 allow-sonarqube permitir-3001 sonar-9000"
