# Frontend — Vercel Deployment

## Quick Deploy

1. Go to https://vercel.com/new
2. Import your GitHub repo: `ADITH6452003/fullstckProject`
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-render-backend.onrender.com/api`

5. Click **Deploy**

## After Deployment

Copy your Vercel URL (e.g. `https://educlass-xyz.vercel.app`) and update the backend's `CLIENT_URL` environment variable on Render.

## Local Development

```bash
cd client
npm install
npm run dev
```
