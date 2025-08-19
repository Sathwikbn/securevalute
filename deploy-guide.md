# 🚀 **Deploy Your Secure Vault - Multiple Platform Options**

## **Option 1: Render (Recommended - Free Tier)**

### Backend Deployment:
1. **Go to [Render.com](https://render.com)**
2. **Sign in with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your repo: `Sathwikbn/securevalute`**
5. **Configure:**
   - **Name**: `vaulty-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: `Free`

### Environment Variables:
```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://... (from MongoDB Atlas)
JWT_SECRET=your_super_secret_key
AES_SECRET=your_aes_secret_key
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=10000
```

---

## **Option 2: DigitalOcean App Platform**

### Backend Deployment:
1. **Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)**
2. **Click "Create App"**
3. **Connect GitHub repo: `Sathwikbn/securevalute`**
4. **Select `server` folder**
5. **Configure:**
   - **Environment**: `Node.js`
   - **Build Command**: `npm install`
   - **Run Command**: `node src/server.js`
   - **Plan**: `Basic ($5/month)`

---

## **Option 3: Heroku**

### Backend Deployment:
1. **Install Heroku CLI:**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create vaulty-backend
   ```

3. **Deploy:**
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a vaulty-backend
   git push heroku master
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set MONGO_URI=mongodb+srv://...
   heroku config:set JWT_SECRET=your_secret
   heroku config:set AES_SECRET=your_aes_secret
   heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app
   ```

---

## **Option 4: Docker + Any Cloud**

### Local Testing:
```bash
# Build and run locally
docker-compose up --build

# Access at http://localhost:3000
```

### Deploy to any cloud:
1. **AWS EC2**
2. **Google Cloud Run**
3. **Azure Container Instances**
4. **Linode**
5. **Vultr**

---

## **Frontend Deployment (All Options):**

### Vercel (Recommended):
1. **Go to [Vercel.com](https://vercel.com)**
2. **Import your GitHub repo**
3. **Configure:**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variable:**
   - `VITE_API_URL` = `https://your-backend-url.render.com`

---

## **MongoDB Setup (All Options):**

### MongoDB Atlas (Free):
1. **Go to [MongoDB Atlas](https://mongodb.com/atlas)**
2. **Create free cluster**
3. **Get connection string**
4. **Use in your backend environment variables**

---

## **Quick Deploy Commands:**

### Render:
```bash
# Clone and deploy
git clone https://github.com/Sathwikbn/securevalute
cd securevalute/server
# Follow Render web interface
```

### DigitalOcean:
```bash
# Use App Platform web interface
# Or CLI if you prefer
```

### Heroku:
```bash
cd server
heroku create vaulty-backend
git push heroku master
```

---

## **Environment Variables Template:**

```bash
# Backend (.env)
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vaulty
JWT_SECRET=your_super_secret_jwt_key_here
AES_SECRET=your_aes_encryption_secret_here
CORS_ORIGIN=https://your-frontend-domain.vercel.app
PORT=5000

# Frontend (.env)
VITE_API_URL=https://your-backend-domain.render.com
```

---

## **Success Checklist:**

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible  
- [ ] MongoDB connected
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] API endpoints responding
- [ ] Frontend can communicate with backend
- [ ] Authentication working
- [ ] Password CRUD operations working

---

## **Need Help?**

- **Render**: Excellent free tier, easy setup
- **DigitalOcean**: Reliable, $5/month starting
- **Heroku**: Classic choice, paid now
- **Docker**: Most flexible, deploy anywhere

**Recommendation**: Start with **Render** for backend (free) + **Vercel** for frontend (free) = **100% Free Deployment!** 🎉 