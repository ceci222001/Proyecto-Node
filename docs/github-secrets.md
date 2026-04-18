# GitHub Secrets para el pipeline

## Secrets requeridos

### SSH y conectividad

- `GCP_SSH_PRIVATE_KEY`
  - llave privada PEM u OpenSSH con acceso a bastion y salto a las VMs privadas
- `BASTION_HOST`
  - `35.222.101.135`
- `BASTION_USER`
  - `g2023171020`
- `BASTION_PROJECT_PATH`
  - ruta donde GitHub Actions copiara el repo en bastion
  - ejemplo: `/home/g2023171020/proyecto-node`

### Servidor Docker privado

- `DOCKER_PRIVATE_HOST`
  - `10.0.2.3`
- `DOCKER_USER`
  - `g2023171020`
- `DOCKER_PROJECT_PATH`
  - ruta final del proyecto en esa VM
  - ejemplo recomendado: `/home/g2023171020/proyecto-node`

### Servidor Nginx

- `NGINX_PRIVATE_HOST`
  - `10.0.1.3`
- `NGINX_USER`
  - `g2023171020`

### SonarQube

- `SONAR_HOST_URL`
  - URL de tu SonarQube
  - ejemplo: `http://35.239.188.208/sonarqube`
- `SONAR_TOKEN`
  - token generado desde SonarQube

## Valores ya conocidos por tu topologia

Puedes cargar ya estos sin esperar mas datos:

```text
BASTION_HOST=35.222.101.135
BASTION_USER=g2023171020
BASTION_PROJECT_PATH=/home/g2023171020/proyecto-node
DOCKER_PRIVATE_HOST=10.0.2.3
DOCKER_USER=g2023171020
DOCKER_PROJECT_PATH=/home/g2023171020/proyecto-node
NGINX_PRIVATE_HOST=10.0.1.3
NGINX_USER=g2023171020
```

## Como cargarlos

En GitHub:

1. `Settings`
2. `Secrets and variables`
3. `Actions`
4. `New repository secret`

## Nota importante

La misma llave privada debe permitir:

- entrar a `bastion-host`
- desde bastion, entrar a `servidor-docker-privado`
- desde bastion, entrar a `servidor-nginx`

Si usas llaves distintas por VM, conviene simplificar eso antes de activar el pipeline.
