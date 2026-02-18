# Deploy to GitHub + Vercel

## 1. Push to GitHub

If you haven’t already, create a new repository on GitHub (e.g. `Debik` or `debikitay-therapy`). Then in this folder:

```bash
git init
git add .
git commit -m "Initial commit: static site ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use “Continue with GitHub”).
2. Click **Add New…** → **Project**.
3. Import your GitHub repo (e.g. `Debik`). Vercel will detect it’s a static site.
4. Leave **Build Command** empty (no build step).
5. **Output Directory**: leave default or set to `.` (project root).
6. Click **Deploy**.

After the first deploy, Vercel will give you a URL like `your-project.vercel.app`. Every push to `main` will trigger a new deployment.

## 3. Custom domain (optional)

In the Vercel project: **Settings** → **Domains** → add your domain (e.g. `debikitaytherapy.com`) and follow the DNS instructions.

## Notes

- **Clean URLs**: `vercel.json` uses `cleanUrls: true`, so `/about` works as well as `/about.html`.
- **Rewrites**: Same content is available with or without `.html` (e.g. `/faq` and `/faq.html`).
