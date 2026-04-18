# Proyecto Node.js con ciclo DevOps

Este repositorio queda preparado como base para un flujo DevOps en GCP con:

- Backend Node.js/Express y frontend React.
- Pruebas con Jest, SuperTest y k6.
- Analisis de calidad con SonarQube.
- Contenerizacion con Docker.
- Reverse proxy con Nginx.
- Observabilidad con Prometheus + cAdvisor + Grafana.
- Estrategia basica de despliegue tipo blue/green a nivel de proxy.

## Estructura principal

- `backend/`: API y pruebas backend.
- `frontend/`: aplicacion web.
- `tests/k6/`: pruebas de carga.
- `infra/nginx/`: configuracion de reverse proxy.
- `infra/prometheus/`: scrapes de monitoreo.
- `infra/grafana/`: datasource y dashboard provisionados.
- `docker-compose.devops.yml`: stack local o para tu docker server.
- `sonar-project.properties`: configuracion de analisis.

## Flujo recomendado para tu infraestructura GCP

1. Entra por bastion al `docker server` y al `nginx server`.
2. Despliega los contenedores de aplicacion, SonarQube, Prometheus, Grafana y cAdvisor en el `docker server`.
3. En el `nginx server` publica el reverse proxy hacia el `docker server` por IP privada.
4. Expone solo Nginx al exterior. SonarQube y Grafana quedan accesibles por rutas como `/sonarqube` y `/grafana`.

Con tu topologia actual:

- `bastion-host`: `35.222.101.135` / `10.0.1.2`
- `servidor-docker-privado`: `10.0.2.3`
- `servidor-nginx`: `35.239.188.208` / `10.0.1.3`

Usa estos archivos:

- `docker-compose.gcp.yml` para `servidor-docker-privado`
- `infra/nginx/gcp-servidor-nginx.conf` para `servidor-nginx`
- `docs/gcp-topologia.md` como guia paso a paso

## Servicios publicados por Nginx

- `/` frontend
- `/api/` backend
- `/grafana/` dashboard
- `/sonarqube/` analisis de calidad
- `/prometheus/` metricas de Prometheus
- `/health` healthcheck backend

## Comandos utiles

### Backend

```bash
cd backend
npm install
npm test
npm run test:coverage
```

### Frontend

```bash
cd frontend
npm install
npm test -- --watchAll=false
npm run build
```

### k6

```bash
k6 run tests/k6/login-load.js
```

### Docker Compose

```bash
docker compose -f docker-compose.devops.yml up -d --build
```

## Pipeline

Se dejo un workflow principal de GitHub Actions:

- `.github/workflows/pipeline.yml`
  - `jest`
  - `k6-load-test`
  - `SonarQube-Scan`
  - `build-and-push`
  - `deploy`

Ese formato produce un grafo de jobs encadenados en GitHub Actions, similar al que esperas visualizar.

Secrets esperados en GitHub:

- `GCP_SSH_PRIVATE_KEY`
- `BASTION_HOST`
- `BASTION_USER`
- `BASTION_PROJECT_PATH`
- `DOCKER_PRIVATE_HOST`
- `DOCKER_USER`
- `DOCKER_PROJECT_PATH`
- `NGINX_PRIVATE_HOST`
- `NGINX_USER`
- `SONAR_TOKEN`
- `SONAR_HOST_URL`

Tambien tienes apoyo operativo en:

- `docs/github-secrets.md`
- `docs/deploy-manual-gcp.md`
- `deploy/deploy-from-bastion.sh`
- `deploy/gcp-firewall-hardening.sh`

## Dashboards de Grafana

Se provisionan automaticamente dos dashboards:

- `Proyecto Node - Infraestructura`
  - CPU y memoria por contenedor
  - CPU y memoria total del stack
  - estado de exporters
- `Proyecto Node - Backend`
  - request rate
  - latencia p95
  - errores 5xx
  - salud del backend
  - trafico por ruta y por codigo HTTP

Prometheus ahora scrapea tambien el endpoint `backend:5000/metrics`.

## Estrategia basica de despliegue

Se dejo una base blue/green simple:

- `backend_blue` y `backend_green` estan definidos en Nginx.
- El slot activo se puede validar con el header `X-Release-Slot`.
- Esto te permite levantar una nueva version, probarla internamente y luego promover trafico.

Para una entrega academica o tecnica, esta estrategia es suficiente para justificar despliegue controlado sin exponer directamente el docker server.
