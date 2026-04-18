# Topologia GCP para este proyecto

## Maquinas actuales

- `bastion-host`
  - Zona: `us-central1-a`
  - IP privada: `10.0.1.2`
  - IP publica: `35.222.101.135`
- `servidor-docker-privado`
  - Zona: `us-central1-a`
  - IP privada: `10.0.2.3`
  - Sin IP publica
- `servidor-nginx`
  - Zona: `us-central1-a`
  - IP privada: `10.0.1.3`
  - IP publica: `35.239.188.208`

## Arquitectura recomendada

- Entrada administrativa: `bastion-host`
- Entrada publica HTTP: `servidor-nginx`
- Ejecucion de contenedores: `servidor-docker-privado`

Flujo:

1. Internet entra solo por `35.239.188.208`.
2. `servidor-nginx` hace reverse proxy por red privada hacia `10.0.2.3`.
3. `servidor-docker-privado` publica solo puertos internos hacia la VPC.
4. La administracion se hace por SSH via `bastion-host`.

## Puertos internos esperados en servidor-docker-privado

- `8080`: frontend
- `5000`: backend
- `3001`: Grafana
- `3002`: cAdvisor
- `9090`: Prometheus
- `9000`: SonarQube

## Riesgos encontrados en las reglas actuales

Tus reglas actuales exponen al mundo servicios que deberian quedar solo detras de Nginx o solo para administracion:

- `allow-monitoreo`
- `allow-monitoreo-2`
- `allow-sonarqube`
- `permitir-3001`
- `sonar-9000`

Eso deja abiertos `3001`, `3002`, `9090`, `9100` y `9000` desde `0.0.0.0/0`.

## Ajuste recomendado de firewall

Mantener publicos:

- `80` solo para la VM con tag `nginx`
- `22` solo para la VM `bastion-host`

Mantener privados solo dentro de la VPC:

- `5000`, `8080`, `3001`, `3002`, `9090`, `9000`

Si quieres endurecerlo mas:

- Permite `22` hacia `servidor-nginx` y `servidor-docker-privado` solo desde `10.0.1.2`
- Permite `5000`, `8080`, `3001`, `9090`, `9000` en `servidor-docker-privado` solo desde `10.0.1.3`

## Despliegue

### En servidor-docker-privado

```bash
cd /ruta/del/proyecto
docker compose -f docker-compose.gcp.yml up -d --build
```

### En servidor-nginx

Copiar `infra/nginx/gcp-servidor-nginx.conf` a `/etc/nginx/conf.d/proyecto-node.conf` y recargar:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## URLs finales

- `http://35.239.188.208/`
- `http://35.239.188.208/api/health`
- `http://35.239.188.208/grafana/`
- `http://35.239.188.208/sonarqube/`
- `http://35.239.188.208/prometheus/`

## Archivos operativos del repo

- `docs/deploy-manual-gcp.md`
- `docs/github-secrets.md`
- `deploy/deploy-from-bastion.sh`
- `deploy/gcp-firewall-hardening.sh`
