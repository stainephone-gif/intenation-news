# GitHub Pages Setup Instructions

This repository is configured to automatically deploy the Moscow Settlement Game to GitHub Pages using GitHub Actions.

## 🚀 Quick Setup

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/stainephone-gif/intenation-news`
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. Click **Save**

### Step 2: Trigger Deployment

The deployment will automatically trigger when you:
- Push to the `claude/moscow-settlement-game-01FvyL582ghW7ysWWtEYUNJ1` branch
- Push to the `main` branch (after merging)
- Manually trigger via **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

### Step 3: Access Your Game

After the workflow completes (usually 2-3 minutes), your game will be live at:

**🎮 https://stainephone-gif.github.io/intenation-news/**

## 📋 What the Workflow Does

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. ✅ Checks out the code
2. ✅ Installs Node.js and dependencies
3. ✅ Builds the React application
4. ✅ Deploys to GitHub Pages

## 🔧 Manual Deployment (Alternative)

If you prefer manual deployment:

### Using gh-pages package

```bash
cd moscow-settlement-game
npm install --save-dev gh-pages
npm run deploy
```

### Using GitHub CLI

```bash
# Build the app
cd moscow-settlement-game
npm run build

# Deploy using gh-pages branch
# (You may need to manually push the build folder to gh-pages branch)
```

## 🛠️ Troubleshooting

### Workflow Not Running?

1. Check the **Actions** tab in your repository
2. Ensure GitHub Actions are enabled (Settings → Actions → Allow all actions)
3. Manually trigger the workflow from the Actions tab

### 404 Error?

1. Wait a few minutes after deployment
2. Check that GitHub Pages is set to **GitHub Actions** as source
3. Verify the `homepage` field in `moscow-settlement-game/package.json` matches your repository

### Build Failing?

1. Check the workflow logs in the **Actions** tab
2. Ensure all dependencies are in `package.json`
3. Try building locally first: `cd moscow-settlement-game && npm run build`

## 📝 Configuration Files

### package.json
The `homepage` field is set to match your GitHub Pages URL:
```json
"homepage": "https://stainephone-gif.github.io/intenation-news"
```

### GitHub Actions Workflow
Located at `.github/workflows/deploy.yml`, this automates the deployment process.

## 🔄 Updating the Game

To update the live version:

1. Make changes to the game code
2. Commit and push to your feature branch
3. The workflow will automatically rebuild and redeploy
4. Changes will be live in 2-3 minutes

## 🎯 Current Status

✅ **Workflow Created**: `.github/workflows/deploy.yml`
✅ **Homepage Configured**: `package.json` updated
✅ **Build Files Ready**: Production build in `moscow-settlement-game/build/`
⏳ **GitHub Pages Source**: *Needs to be set to "GitHub Actions" in repository settings*

## 📱 Alternative Deployments

### Netlify
1. Create account at netlify.com
2. Connect GitHub repository
3. Set build directory: `moscow-settlement-game/build`
4. Deploy!

### Vercel
1. Create account at vercel.com
2. Import GitHub repository
3. Set root directory: `moscow-settlement-game`
4. Deploy!

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## ✨ Features

Once deployed, your game includes:

- ✅ Character creation system
- ✅ Immigration arrival scene
- ✅ Transport choice mechanics
- ✅ Resource management
- ✅ Results and ranking system
- ✅ Mobile-responsive design
- ✅ Smooth animations

---

**After enabling GitHub Pages in your repository settings, the game will be live at:**

**🎮 https://stainephone-gif.github.io/intenation-news/**

Enjoy playing!
