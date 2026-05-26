#!/bin/bash
set -euo pipefail

APP_DIR="/home/ubuntu/app"
RDS_ENDPOINT="contact-hybrid-docker-db.c9w2ic2o8kxr.ap-southeast-1.rds.amazonaws.com"

cat > "$APP_DIR/backend/.env" << EOF
DATABASE_URL=mysql://admin:ContactHybridDocker123!@$RDS_ENDPOINT:3306/contact_db
PORT=3000
NODE_ENV=production
EOF

echo "✅ .env updated with RDS endpoint: $RDS_ENDPOINT"
