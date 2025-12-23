---
description: Deploy the application to GitHub Pages
---

To deploy the application to GitHub Pages, follow these steps:

1. **Initialize Git (if not already done)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a repository on GitHub**:
   Go to GitHub and create a new repository named `gym-planner`.

3. **Link your local repository to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/gym-planner.git
   git branch -M main
   git push -u origin main
   ```

4. **Install the deployment tool**:
   ```bash
   npm install --save-dev gh-pages
   ```

5. **Deploy**:
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Settings > Pages.
   - Under "Build and deployment", ensure Source is set to "Deploy from a branch".
   - Select the `gh-pages` branch and the `/ (root)` folder.
   - Click "Save".

Your app will be available at `https://YOUR_USERNAME.github.io/gym-planner/`.
