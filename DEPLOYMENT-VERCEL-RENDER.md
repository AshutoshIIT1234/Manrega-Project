# Deploy to Vercel (Frontend) + Render (Backend)

This guide covers deploying your MGNREGA dashboard with the frontend on Vercel and backend on Render.

## Architecture

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: Render PostgreSQL

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### 1.2 Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `mgnrega-db`
3. Database: `mgnrega`
4. User: `mgnrega_user`
5. Region: Choose closest to your users
6. Plan: Free tier is fine for testing
7. Click "Create Database"
8. **Save the Internal Database URL** (starts with `postgresql://`)

### 1.3 Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `mgnrega-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `Manrega-Project` (if not root)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free

### 1.4 Add Environment Variables

In Render dashboard, go to Environment tab and add:

```
PORT=5000
NODE_ENV=production
DATABASE_URL=[paste your Internal Database URL from step 1.2]
API_BASE_URL=https://api.data.gov.in
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Note**: You'll update `ALLOWED_ORIGINS` after deploying to Vercel

### 1.5 Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL: `https://mgnrega-api.onrender.com`

### 1.6 Initialize Database

After first deployment:

1. Go to Shell tab in Render dashboard
2. Run: `npm run setup-db`

## Step 2: Deploy Frontend to Vercel

### 2.1 Update API Configuration

First, update your frontend to use environment variable for API URL.

Edit `Manrega-Project/src/utils/api.js` (or wherever you make API calls):

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
  getDistricts: () =>
    fetch(`${API_BASE_URL}/api/districts`).then((r) => r.json()),
  // ... other API calls
};
```

### 2.2 Create Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### 2.3 Import Project

1. Click "Add New..." → "Project"
2. Import your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Manrega-Project` (if not root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.4 Add Environment Variables

In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://mgnrega-api.onrender.com
VITE_NODE_ENV=production
```

Replace `mgnrega-api.onrender.com` with your actual Render backend URL.

### 2.5 Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your frontend URL: `https://your-app.vercel.app`

## Step 3: Update CORS Settings

### 3.1 Update Backend Environment Variables

Go back to Render dashboard → your web service → Environment:

Update `ALLOWED_ORIGINS` with your Vercel URLs:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

For preview deployments, use wildcard:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

### 3.2 Redeploy Backend

Click "Manual Deploy" → "Deploy latest commit"

## Step 4: Test Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Check browser console for errors
3. Test API calls:
   ```bash
   curl https://mgnrega-api.onrender.com/api/health
   ```

## Step 5: Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to Project Settings → Domains
2. Add your domain (e.g., `mgnrega.yourdomain.com`)
3. Update DNS records as instructed
4. SSL is automatic

### For Render (Backend)

1. Go to Settings → Custom Domain
2. Add subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records
4. Update `VITE_API_URL` in Vercel to use new domain

## Environment Variables Reference

### Backend (.env.example.render)

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
API_BASE_URL=https://api.data.gov.in
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env.example.vercel)

```env
VITE_API_URL=https://mgnrega-api.onrender.com
VITE_NODE_ENV=production
```

## Important Notes

### Render Free Tier Limitations

- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service)
- Consider upgrading to paid plan ($7/month) for always-on service

### Vercel Free Tier

- Unlimited deployments
- Automatic preview deployments for PRs
- 100GB bandwidth/month
- Perfect for frontend hosting

### Database Backups

Render free tier doesn't include automatic backups. For production:

1. Upgrade to paid plan ($7/month) for daily backups
2. Or manually backup via Render shell:
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

## Troubleshooting

### CORS Errors

- Verify `ALLOWED_ORIGINS` includes your Vercel URL
- Check browser console for exact error
- Ensure backend is redeployed after CORS changes

### API Not Responding

- Check Render logs: Dashboard → Logs tab
- Verify environment variables are set
- Test health endpoint: `https://your-backend.onrender.com/api/health`

### Database Connection Failed

- Verify `DATABASE_URL` is correct
- Check database is running in Render dashboard
- Run `npm run setup-db` in Render shell

### Build Failures on Vercel

- Check build logs in Vercel dashboard
- Verify `VITE_API_URL` is set
- Ensure all dependencies are in `package.json`

### Slow First Load

- This is normal for Render free tier (cold start)
- Consider upgrading to paid plan
- Or implement loading state in frontend

## Continuous Deployment

Both platforms auto-deploy on git push:

- **Vercel**: Deploys on every push to `main`
- **Render**: Deploys on every push to `main`

To disable auto-deploy:

- **Vercel**: Settings → Git → Disable
- **Render**: Settings → Auto-Deploy → Disable

## Monitoring

### Render

- View logs: Dashboard → Logs
- Monitor metrics: Dashboard → Metrics
- Set up alerts: Settings → Notifications

### Vercel

- View deployments: Dashboard → Deployments
- Analytics: Dashboard → Analytics (paid feature)
- Monitor performance: Dashboard → Speed Insights

## Cost Estimate

### Free Tier (Testing)

- Render: $0 (with limitations)
- Vercel: $0
- **Total: $0/month**

### Production (Recommended)

- Render Web Service: $7/month
- Render PostgreSQL: $7/month
- Vercel: $0 (free tier sufficient)
- **Total: $14/month**

### With Custom Domain

- Domain registration: ~$12/year
- SSL: Free (included)
- **Total: ~$15/month**

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS settings
4. ✅ Test deployment
5. ⬜ Add custom domain
6. ⬜ Setup monitoring
7. ⬜ Configure backups
8. ⬜ Add analytics (optional)

## Support

- **Render**: [render.com/docs](https://render.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Issues**: Check application logs first
