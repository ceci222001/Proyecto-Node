# Despliegue manual en tu topologia GCP

## Topologia

- Bastion publico: `35.222.101.135`
- Docker privado: `10.0.2.3`
- Nginx publico: `35.239.188.208`

## Paso 1. Copiar el proyecto al bastion

Desde tu maquina local:

```bash
scp -r Proyecto-Node g2023171020@35.222.101.135:~/proyecto-node
```

## Paso 2. Entrar al bastion

```bash
ssh g2023171020@35.222.101.135
```

## Paso 3. Enviar codigo al servidor Docker privado

Desde el bastion:

```bash
rsync -az --delete \
  --exclude ".git" \
  --exclude "backend/node_modules" \
  --exclude "frontend/node_modules" \
  ~/proyecto-node/ g2023171020@10.0.2.3:/opt/proyecto-node
```

## Paso 4. Levantar contenedores

```bash
ssh g2023171020@10.0.2.3
cd /opt/proyecto-node
docker compose -f docker-compose.gcp.yml up -d --build
docker ps
```

## Paso 5. Publicar Nginx

Desde el bastion:

```bash
scp ~/proyecto-node/infra/nginx/gcp-servidor-nginx.conf g2023171020@10.0.1.3:/tmp/proyecto-node.conf
ssh g2023171020@10.0.1.3
sudo mv /tmp/proyecto-node.conf /etc/nginx/conf.d/proyecto-node.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Paso 6. Verificar

Desde tu maquina o Cloud Shell:

```bash
curl http://35.239.188.208/health
curl http://35.239.188.208/api/health
```

Abre en navegador:

- `http://35.239.188.208/`
- `http://35.239.188.208/grafana/`
- `http://35.239.188.208/sonarqube/`
- `http://35.239.188.208/prometheus/`

## Paso 7. Prueba de carga

```bash
k6 run tests/k6/login-load.js
```

Si corres k6 desde fuera de la VM:

```bash
BASE_URL=http://35.239.188.208/api k6 run tests/k6/login-load.js
```
