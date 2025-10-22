# Production Deployment Guide

## Prerequisites
1. Docker and Docker Compose installed on your server
2. nginx-proxy and Let's Encrypt containers running
3. Volume directories created

## Step 1: Prepare Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env with your production values
nano .env
```

## Step 2: Create Required Directories
```bash
# Create log directory (only this one is needed for bind mount)
sudo mkdir -p /vol/log/sullo-co_app

# Set proper permissions
sudo chown -R $USER:$USER /vol/log/sullo-co_app

# Note: PostgreSQL data is stored in a Docker named volume 'postgres-data'
# No need to create /vol/data/pg directory
```

## Step 3: Deploy PostgreSQL
```bash
# Start PostgreSQL container
./docker/postgres.sh

# Verify it's running
docker ps | grep postgres
```

## Step 4: Initialize Database
```bash
# Initialize database schema
POSTGRES_HOST=postgres POSTGRES_PORT=5432 POSTGRES_USER=postgres POSTGRES_PASSWORD=your_password POSTGRES_DB=hooq node scripts/init-postgres-db.js

# Migrate tiles data
POSTGRES_HOST=postgres POSTGRES_PORT=5432 POSTGRES_USER=postgres POSTGRES_PASSWORD=your_password POSTGRES_DB=hooq node scripts/migrate-tiles-postgres.js
```

## Step 5: Deploy Application
```bash
# Deploy the application
./docker/node.sh

# Verify it's running
docker ps | grep sullo-co
```

## Step 6: Verify Deployment
```bash
# Check application logs
docker logs sullo-co

# Test API endpoint
curl http://localhost:9050/api/tiles

# Test website
curl http://localhost:9050/
```

## Docker Volume Management

### PostgreSQL Data Volume
The PostgreSQL container uses a Docker named volume `postgres-data` for data persistence:

```bash
# List Docker volumes
docker volume ls

# Inspect the postgres-data volume
docker volume inspect postgres-data

# Backup PostgreSQL data (optional)
docker run --rm -v postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# Restore PostgreSQL data (optional)
docker run --rm -v postgres-data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /data
```

### Application Logs
Application logs are stored in `/vol/log/sullo-co_app` on the host:
```bash
# View application logs
tail -f /vol/log/sullo-co_app/app.log

# Check log directory
ls -la /vol/log/sullo-co_app/
```

## Environment Variables Explained

### Production (.env file):
```bash
POSTGRES_HOST=postgres          # Container name from Docker link
POSTGRES_PORT=5432             # Standard PostgreSQL port
POSTGRES_USER=postgres         # Database user
POSTGRES_PASSWORD=secure_pass  # Your secure password
POSTGRES_DB=hooq              # Database name
PGDATA=/vol/data/pg           # Volume mount path
NODE_ENV=production           # Production mode
```

### Local Development:
```bash
POSTGRES_HOST=localhost        # Local PostgreSQL
POSTGRES_PORT=5432            # Local port
POSTGRES_USER=postgres        # Local user
POSTGRES_PASSWORD=local_pass  # Local password
POSTGRES_DB=hooq             # Local database
```

## Troubleshooting

### Database Connection Issues:
1. Check if PostgreSQL container is running: `docker ps | grep postgres`
2. Check PostgreSQL logs: `docker logs some-postgres`
3. Verify environment variables: `docker exec sullo-co env | grep POSTGRES`

### Application Issues:
1. Check application logs: `docker logs sullo-co`
2. Verify build completed: `docker exec sullo-co ls -la /usr/src/app/dist`
3. Test API directly: `curl http://localhost:9050/api/tiles`

### Volume Issues:
1. Check Docker named volume: `docker volume ls | grep postgres-data`
2. Verify PostgreSQL data directory: `docker exec some-postgres ls -la /var/lib/postgresql/data`
3. Check application log directory: `ls -la /vol/log/sullo-co_app`
