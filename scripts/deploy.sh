#!/bin/bash
set -euo pipefail

APP_DIR="/home/ubuntu/app"
BRANCH="main"

echo "=========================================="
echo "🚀 Hybrid Docker Deploy Starting"
echo "=========================================="

cd "$APP_DIR"

# Step 1 — Pull latest code via deploy key
echo "[1/5] Pulling latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

# Step 2 — Update .env with RDS endpoint
echo "[2/5] Updating environment..."
bash "$APP_DIR/scripts/update-env.sh"

# Step 3 — Build and start containers
echo "[3/5] Building and starting Docker containers..."
docker compose down
docker compose up --build -d

# Step 4 — Cleanup old images
echo "[4/5] Cleaning up old Docker images..."
docker system prune -f

# Step 5 — Verify
echo "[5/5] Verifying containers..."
docker compose ps

echo ""
echo "=========================================="
echo "✅ Deploy Complete!"
echo "=========================================="
