# AWS Setup — Hybrid Docker on EC2

> **Method:** 100% AWS CLI
> **Region:** ap-southeast-1 (Singapore)
> **Account:** 310918476570

## Architecture

```
User → ALB (SSL) → EC2:80 → Nginx Container → Backend/Frontend Containers
                                     ↓
                                   RDS MySQL
```

## Resource List

| Resource | ID | Notes |
|----------|-----|-------|
| VPC | vpc-005d3068f03bd916d | 10.1.0.0/16 |
| Internet Gateway | igw-062bf8a8652f0ce12 | Attached to VPC |
| Public Subnet 1a | subnet-01ce573d751136533 | 10.1.1.0/24 |
| Public Subnet 1b | subnet-09e55e4bba20d1b47 | 10.1.2.0/24 |
| Private Subnet 1a | subnet-0d4d3d51713c724e8 | 10.1.3.0/24 |
| Private Subnet 1b | subnet-0611a1345cbb1b3d3 | 10.1.4.0/24 |
| Route Table | rtb-0fbab2e6dbd111569 | Public route to IGW |
| ALB Security Group | sg-086efc4854e0624c3 | Allow 80/443 from 0.0.0.0/0 |
| EC2 Security Group | sg-0eb4a53299bfaa8de | Allow 80 from ALB SG, 22 from admin |
| RDS Security Group | sg-08e5969b83ff4eecb | Allow 3306 from EC2 SG |
| ACM Certificate | arn:aws:acm:ap-southeast-1:310918476570:certificate/784a61de-dfc3-4b4b-aa8a-ed0c89b6e38b | hybrid-docker.gaskeun.web.id |
| EC2 Key Pair | contact-hybrid-docker-ec2-key | RSA 4096 |
| EC2 Instance | i-0f91600e86d78d2ad | t3.micro, Ubuntu 22.04 |
| Elastic IP | 13.213.186.124 | eipalloc-0a514f76c40844ac1 |
| RDS Instance | contact-hybrid-docker-db | MySQL 8.0.40, db.t3.micro |
| RDS Subnet Group | contact-hybrid-docker-rds-subnet-group | 2 private subnets |
| ALB | contact-hybrid-docker-alb | contact-hybrid-docker-alb-1576606327.ap-southeast-1.elb.amazonaws.com |
| Target Group | contact-hybrid-docker-tg | HTTP:80, health /health |
| HTTP Listener | port 80 → redirect 443 | |
| HTTPS Listener | port 443 → forward to TG | |

## Domain

- **Custom Domain:** `https://hybrid-docker.gaskeun.web.id`
- **ALB DNS:** `contact-hybrid-docker-alb-1576606327.ap-southeast-1.elb.amazonaws.com`

## GitHub Actions

Workflow: `.github/workflows/deploy-hybrid-docker.yml`
Trigger: Push to `main` branch or manual `workflow_dispatch`

## GitHub Secrets

| Secret | Value |
|--------|-------|
| EC2_HOST | 13.213.186.124 |
| EC2_USER | ubuntu |
| EC2_SSH_KEY | (private key) |
| DEPLOY_KEY | (repo deploy key) |

## Deploy Commands

```bash
# Manual deploy from EC2
cd /home/ubuntu/app
bash scripts/deploy.sh
```

## Park & Restore

See [PARK-RESTORE.md](PARK-RESTORE.md)
