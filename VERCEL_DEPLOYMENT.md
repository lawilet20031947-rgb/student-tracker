# Vercel Deployment Guide

## Prerequisites
- GitHub account with the repository pushed (already done)
- Vercel account (free tier available at vercel.com)
- Firebase environment variables ready

## Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select your **"student-performance-and-attendance-tracker"** repository (or your repo name)
5. Click **"Import"**

## Step 2: Configure Build Settings

In the **"Configure Project"** dialog:

### Root Directory
- **Root Directory:** `frontend` (because frontend is in a subdirectory)
- Click **"Edit"** next to the path field and select the `frontend` folder

### Build Command
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Step 3: Add Environment Variables

In the **"Environment Variables"** section, add these from your `.env.local`:

```
VITE_FIREBASE_API_KEY=<your_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_storage_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_messaging_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>
```

**Where to find these:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Under **"Your apps"**, click the web app
5. Copy the config object values into the corresponding VITE_* variables above

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (typically 1-2 minutes)
3. Once complete, Vercel will show your live URL (e.g., `https://student-tracker-abc123.vercel.app`)

## Step 5: Verify Deployment

1. Open the Vercel URL in your browser
2. Test the full flow:
   - ✅ Login/Signup works
   - ✅ Firebase Status shows "Connected"
   - ✅ Can create attendance records
   - ✅ Can create performance records
   - ✅ Delete buttons appear for owned records (Teachers only)
   - ✅ Admin Dashboard shows all records
   - ✅ Teacher Dashboard shows only teacher-created records
   - ✅ Student Dashboard shows only own records

## Step 6: Deploy Firestore Rules (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Click **"Edit rules"**
5. Replace all content with the rules from `firestore.rules.example` in this repository
6. Click **"Publish"**

## Troubleshooting

### Build fails with "Cannot find module 'firebase'"
- Make sure `firebase` is installed: `npm install firebase` in the `frontend` directory
- Check `frontend/package.json` has firebase listed in dependencies

### Environment variables not loading
- Check spelling of `VITE_*` prefix (must be exactly `VITE_`)
- Variables must start with `VITE_` to be exposed to frontend
- Redeploy after adding environment variables

### Firebase connection shows "Not Configured" (gray badge)
- Verify all `VITE_FIREBASE_*` environment variables are set
- Check they match your Firebase project exactly
- Redeploy to apply changes

### Delete buttons don't appear
- Make sure you're logged in as an Admin or Teacher
- If logged in as Student, delete buttons won't show (read-only access)
- Check browser console for errors

## Continuous Deployment

Every time you push to GitHub, Vercel automatically:
1. Detects the push
2. Runs the build command
3. Deploys if build succeeds
4. Rolls back if build fails (previous version stays live)

## Reverting to Previous Deployment

In Vercel dashboard:
1. Go to **"Deployments"** tab
2. Click the three-dot menu on a previous deployment
3. Select **"Promote to Production"**

## Next Steps

- Add custom domain (Vercel → Settings → Domains)
- Set up monitoring (Vercel Analytics available in Pro plan)
- Configure custom error pages
- Add CI/CD checks (run tests before deploying)
