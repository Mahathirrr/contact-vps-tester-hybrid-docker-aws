#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."

# Wait for MySQL to accept connections (max 60 seconds)
MAX_RETRIES=30
RETRY_COUNT=0

# Dynamically extract DB host from DATABASE_URL, fallback to 'db'
DB_HOST="${DB_HOST:-$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')}"
DB_HOST="${DB_HOST:-db}"

echo "   Connecting to DB at host: $DB_HOST"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if node -e "
const net = require('net');
const c = net.createConnection(3306, '$DB_HOST');
c.on('connect', () => { c.destroy(); process.exit(0); });
c.on('error', () => { c.destroy(); process.exit(1); });
" 2>/dev/null; then
        echo "✅ Database is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Database not ready yet... retry $RETRY_COUNT/$MAX_RETRIES"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Database connection failed after $MAX_RETRIES retries"
    exit 1
fi

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy
echo "✅ Migrations completed!"

# Start the application
echo "🚀 Starting the application..."
exec node src/main.js
