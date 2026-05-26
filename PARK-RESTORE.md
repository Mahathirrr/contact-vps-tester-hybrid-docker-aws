# Park & Restore — Hybrid Docker

## What is Park Mode?

Park Mode means stopping expensive compute resources while keeping infrastructure and data intact.

## Resources to Stop (Save Money)

| Resource | Action | Savings |
|----------|--------|---------|
| EC2 Instance | Stop | ~$7.59/month |
| RDS Instance | Stop | ~$12.41/month |

## Resources to Keep (Small Cost)

| Resource | Cost When Parked | Why Keep |
|----------|-----------------|----------|
| Elastic IP | $0 (attached to stopped EC2) | Keep same IP |
| ALB | ~$16.06/month | Avoid DNS change |
| ACM Certificate | Free | No re-validation |
| VPC/Subnets | Free | Infrastructure |
| Security Groups | Free | Rules persist |
| EBS Storage (8GB) | ~$0.80/month | Data persistence |
| RDS Storage (20GB) | ~$2.30/month | Database persistence |

## Park

```bash
aws ec2 stop-instances --instance-ids i-0f91600e86d78d2ad
aws rds stop-db-instance --db-instance-identifier contact-hybrid-docker-db
```

## Restore

```bash
aws rds start-db-instance --db-instance-identifier contact-hybrid-docker-db
aws ec2 start-instances --instance-ids i-0f91600e86d78d2ad
```

Then on EC2:
```bash
cd /home/ubuntu/app
docker compose up -d
```

## Verify After Restore

```bash
curl https://hybrid-docker.gaskeun.web.id/
curl https://hybrid-docker.gaskeun.web.id/health
```

## RDS 7-Day Auto-Start Rule

AWS may auto-start stopped RDS after ~7 days for security patches. If parked longer, check and stop again.
