# Contact VPS Tester — Hybrid Docker on AWS

Hybrid deployment: Docker containers on EC2 + RDS + ALB.

## Architecture

```
User → ALB (SSL termination) → EC2:80 → Nginx Container → Backend/Frontend Containers
                                          ↓
                                        RDS MySQL
```

All application services run inside Docker containers on a single EC2 instance.

## Key Differences from Hybrid Manual

| Aspect | Hybrid Manual | Hybrid Docker (This) |
|--------|---------------|----------------------|
| Backend runtime | PM2 (Node.js on host) | Docker container |
| Frontend runtime | Host Nginx (static files) | Docker container (Nginx) |
| Reverse proxy | Host Nginx | Docker Nginx container |
| Deploy command | `npm install` + `pm2 reload` | `docker compose up --build -d` |
| Process manager | PM2 + systemd | Docker daemon + restart policy |
| Logging | PM2 logs on disk | `docker logs` + json-file driver |
| Health check | N/A | Docker container healthcheck |
| Memory limit | N/A | Docker `mem_limit` |

## AWS Resources

| Resource | Identifier |
|----------|------------|
| VPC | vpc-005d3068f03bd916d |
| EC2 | i-0f91600e86d78d2ad |
| RDS | contact-hybrid-docker-db |
| ALB | contact-hybrid-docker-alb |
| EIP | 13.213.186.124 |

## Domain

`https://hybrid-docker.gaskeun.web.id`

## Local Development

```bash
# Build and run locally
docker compose up --build -d

# View logs
docker compose logs -f backend
docker compose logs -f nginx

# Stop
docker compose down
```

## Deployment

Triggered automatically on push to `main` via GitHub Actions.

## GitHub Secrets

| Secret | Description |
|--------|-------------|
| EC2_HOST | Public IP of EC2 instance |
| EC2_USER | SSH username (ubuntu) |
| EC2_SSH_KEY | Private key for SSH |
| DEPLOY_KEY | Deploy key for repo checkout |

## Park & Restore

See [PARK-RESTORE.md](PARK-RESTORE.md)
