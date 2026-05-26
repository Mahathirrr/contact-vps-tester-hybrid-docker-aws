#!/bin/bash
set -euo pipefail

echo "=========================================="
echo "🛠️  Setting up EC2 for Docker"
echo "=========================================="

# Update system
echo "[1/5] Updating system packages..."
sudo apt-get update

# Install Docker
echo "[2/5] Installing Docker Engine..."
curl -fsSL https://get.docker.com | sh

# Add user to docker group
echo "[3/5] Adding ubuntu to docker group..."
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
echo "[4/5] Installing Docker Compose plugin..."
sudo apt-get install -y docker-compose-plugin

# Enable Docker auto-start
echo "[5/5] Enabling Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

echo ""
echo "=========================================="
echo "✅ Docker Setup Complete!"
echo "Please log out and log back in for docker group to take effect."
echo "=========================================="
