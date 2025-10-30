# MGNREGA Dashboard - Deployment Guide

## Overview
This guide covers deploying the MGNREGA District Performance Dashboard to production. The application consists of a React frontend, Node.js/Express backend, and PostgreSQL database.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- A VPS or cloud hosting provider (DigitalOcean, AWS, Linode, etc.)
- Domain name (optional but recommended)
- Git installed on your server

## Quick Start

### 1. Server Setup

#### Option A: Ubuntu/Debian VPS
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Option B: Docker Deployment
See the Docker section below for containerized deployment.

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE mgnrega;
CREATE USER mgnrega_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mgnrega TO mgnrega_user;
\q
```

### 3. Application Deployment

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> mgnrega-dashboard
cd mgnrega-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env
nano .env
```

### 4. Environment Configuration

Edit `.env` with your production values:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://mgnrega_user:your_secure_password@localhost:5432/mgnrega

# API Configuration
API_BASE_URL=https://api.data.gov.in

# Optional: CORS settings
ALLOWED_ORIGINS=https://yourdomain.com
```

### 5. Initialize Database

```bash
# Run database setup script
npm run setup-db
```

### 6. Build Frontend

```bash
# Build production assets
npm run build
```

This creates optimized files in the `dist/` directory.

### 7. Start Application with PM2

```bash
# Start the server
pm2 start server/index.js --name mgnrega-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 8. Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/mgnrega
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve static files
    location / {
        root /var/www/mgnrega-dashboard/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/mgnrega /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. SSL Certificate (Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Docker Deployment

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build frontend
RUN npm run build

EXPOSE 5000

CMD ["node", "server/index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: mgnrega
      POSTGRES_USER: mgnrega_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://mgnrega_user:${DB_PASSWORD}@postgres:5432/mgnrega
      NODE_ENV: production
      PORT: 5000
    depends_on:
      - postgres
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy with Docker:

```bash
# Build and start
docker-compose up -d

# Initialize database
docker-compose exec app npm run setup-db

# View logs
docker-compose logs -f
```

## Platform-Specific Deployments

### Vercel (Frontend Only)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

Note: Deploy backend separately (Railway, Render, etc.)

### Railway

1. Connect your GitHub repository
2. Add PostgreSQL service
3. Set environment variables
4. Deploy automatically on push

### Render

1. Create new Web Service
2. Connect repository
3. Set build command: `npm install && npm run build`
4. Set start command: `node server/index.js`
5. Add PostgreSQL database
6. Configure environment variables

### DigitalOcean App Platform

1. Create new app from GitHub
2. Add PostgreSQL database
3. Configure build settings
4. Set environment variables
5. Deploy

## Post-Deployment

### 1. Verify Deployment

```bash
# Check API health
curl https://yourdomain.com/api/health

# Check PM2 status
pm2 status

# View logs
pm2 logs mgnrega-api
```

### 2. Setup Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Database Backups

Create backup script `/var/www/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mgnrega"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
pg_dump -U mgnrega_user mgnrega > $BACKUP_DIR/mgnrega_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

Setup cron job:

```bash
crontab -e
# Add: 0 2 * * * /var/www/backup-db.sh
```

### 4. Setup Cron for Data Sync

The application includes automatic data syncing via node-cron. Verify it's running:

```bash
# Check logs for sync messages
pm2 logs mgnrega-api | grep sync
```

## Maintenance

### Update Application

```bash
cd /var/www/mgnrega-dashboard
git pull origin main
npm install
npm run build
pm2 restart mgnrega-api
```

### Database Migrations

```bash
# Backup first
pg_dump -U mgnrega_user mgnrega > backup.sql

# Run migrations
npm run setup-db
```

### Monitor Resources

```bash
# Check disk space
df -h

# Check memory
free -h

# Check PostgreSQL connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs mgnrega-api --lines 100

# Check port availability
sudo netstat -tulpn | grep 5000
```

### Database connection issues
```bash
# Test connection
psql -U mgnrega_user -d mgnrega -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Nginx errors
```bash
# Check configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### High memory usage
```bash
# Restart application
pm2 restart mgnrega-api

# Check memory
pm2 monit
```

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Enable firewall (ufw)
- [ ] Setup SSL certificate
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Setup automated backups
- [ ] Enable fail2ban
- [ ] Use environment variables for secrets
- [ ] Restrict database access
- [ ] Setup monitoring and alerts

## Performance Optimization

### Enable Gzip in Nginx

Add to nginx config:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### Database Indexing

```sql
-- Add indexes for better query performance
CREATE INDEX idx_district_code ON performance_data(district_code);
CREATE INDEX idx_date ON performance_data(date);
```

### Caching

Consider adding Redis for API response caching:

```bash
sudo apt install redis-server
npm install redis
```

## Support

For issues or questions:
- Check application logs: `pm2 logs mgnrega-api`
- Review Nginx logs: `/var/log/nginx/`
- Check database logs: `/var/log/postgresql/`

## License

[Your License Here]
