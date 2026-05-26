# Contact VPS Tester — Hybrid Docker on AWS

Hybrid deployment: Docker containers on EC2 + RDS + ALB.

## Architecture

```
User → ALB (SSL) → EC2:80 → Nginx Container → Backend/Frontend Containers
                                     ↓
                                   RDS MySQL
```

All application services run inside Docker containers on a single EC2 instance.

## AWS Resources

| Resource | Identifier |
|---|---|
| VPC | (to be created) |
| EC2 | (to be created) |
| RDS | contact-hybrid-docker-db |
| ALB | (to be created) |

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

Triggered automatically on push to `master` via GitHub Actions.

## GitHub Secrets

| Secret | Description |
|---|---|
| `EC2_HOST` | Public IP of EC2 instance |
| `EC2_USER` | SSH username (ubuntu) |
| `EC2_SSH_KEY` | Private key for SSH |

## Domain

`https://hybrid-docker.gaskeun.web.id`
