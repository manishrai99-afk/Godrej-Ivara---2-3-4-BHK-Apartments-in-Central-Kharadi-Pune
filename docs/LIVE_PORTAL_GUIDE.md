# Godrej Ivara Kharadi — Live Portal & Deployment Manual

**Document ID:** OPS-DEPLOY-2026-IVARA  
**Target Organization:** 24k Realtors Hinjewadi  
**Live Portal Target URL:** `https://24krealtorshinjewadi-blip.github.io/Godrej-Ivara---2-3-4-BHK-Apartments-in-Central-Kharadi-Pune/`  
**Hosting Model:** Serverless Static Single-Page Application (SPA) on Edge CDN  
**Release Version:** Production 1.0

---

## 1. Overview & Live Portal Target

The **Godrej Ivara Kharadi** portal is engineered to run seamlessly across high-performance, globally distributed Content Delivery Networks (CDNs). It requires no Node.js runtime, Python server, or PHP daemon, ensuring 100% uptime, immunity to traditional backend server vulnerabilities, and millisecond response times.

### Official Live Portal Link
When GitHub Pages is enabled on the receiving organization repository, the site is immediately accessible worldwide at:
```text
https://24krealtorshinjewadi-blip.github.io/Godrej-Ivara---2-3-4-BHK-Apartments-in-Central-Kharadi-Pune/
```

---

## 2. Enabling GitHub Pages (3 Simple Steps)

If you are setting up the repository for the first time under the `24krealtorshinjewadi-blip` account:

1. **Navigate to Repository Settings:**
   - Open your browser and go to:  
     `https://github.com/24krealtorshinjewadi-blip/Godrej-Ivara---2-3-4-BHK-Apartments-in-Central-Kharadi-Pune/settings`
2. **Open the Pages Section:**
   - In the left sidebar, click on **Pages** (under the "Code and automation" grouping).
3. **Select Source & Branch:**
   - Under **Build and deployment** → **Source**, select **GitHub Actions** (recommended) OR select **Deploy from a branch**.
   - If choosing **Deploy from a branch**:
     - **Branch:** select `main`
     - **Folder:** select `/(root)`
     - Click **Save**.
4. **Instant Live Portal:**
   - GitHub will initiate the deployment. Within 30 to 60 seconds, a green banner will appear displaying:  
     `Your site is live at https://24krealtorshinjewadi-blip.github.io/Godrej-Ivara---2-3-4-BHK-Apartments-in-Central-Kharadi-Pune/`

---

## 3. Automated CI/CD Pipeline (GitHub Actions)

This repository includes a pre-configured, production-grade GitHub Actions continuous deployment pipeline located at:
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

### How It Works:
- Every time you push a commit or merge a pull request into `main`, GitHub Actions automatically:
  1. Checks out the code repository.
  2. Sets up GitHub Pages deployment environment.
  3. Uploads the production assets (`index.html`, `css/`, `js/`, `assets/`, `docs/`).
  4. Deploys to GitHub's global CDN with automated cache invalidation.
- **Zero manual FTP, SSH, or server deployment needed!**

---

## 4. Custom Domain & DNS Setup (Commercial Brand Launch)

If the company plans to point a custom domain (e.g. `godrej-ivara.com` or a subdomain like `ivara.24krealtors.com`) to this live portal:

### 4.1 Subdomain Configuration (e.g. `ivara.24krealtors.com`)
1. In your DNS manager (GoDaddy, Cloudflare, Hostinger, Namecheap), add a **CNAME** record:
   - **Type:** `CNAME`
   - **Host / Name:** `ivara`
   - **Points to / Target:** `24krealtorshinjewadi-blip.github.io`
   - **TTL:** Automatic or 300 seconds
2. In the GitHub repository settings under **Pages** → **Custom domain**, enter `ivara.24krealtors.com` and click **Save**.
3. Check the box for **Enforce HTTPS** once the automatic Let's Encrypt certificate generates (takes ~15 minutes).

### 4.2 Apex Domain Configuration (e.g. `godrej-ivara.com`)
If using a standalone root domain, configure four **A** records pointing to GitHub's IP addresses:
```text
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```
And add a `CNAME` for the `www` subdomain:
```text
CNAME   www   24krealtorshinjewadi-blip.github.io
```

---

## 5. Alternative 1-Click Hosting Platforms

If the company chooses to host on alternate cloud infrastructure:

### Option A: Cloudflare Pages (Fastest Worldwide)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**.
2. Click **Create Application** → **Pages** → **Connect to Git**.
3. Select `24krealtorshinjewadi-blip/Godrej-Ivara---2-3-4-BHK-Apartments-in-Central-Kharadi-Pune`.
4. Framework preset: **None** (Static HTML). Build command: *leave empty*. Output directory: *leave empty*.
5. Click **Save and Deploy**.

### Option B: Netlify
1. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Connect your GitHub repository.
3. Publish directory: `.`
4. Click **Deploy Site**.

### Option C: Vercel
1. Go to [Vercel](https://vercel.com) → **Add New** → **Project**.
2. Import repository.
3. Framework: **Other** / Static. Root directory: `./`.
4. Click **Deploy**.

---

## 6. Post-Deployment Verification & Smoke Test Checklist

Once deployed to production, execute the following smoke tests:

- [ ] **DNS & HTTPS:** Visit the live URL; verify the SSL padlock icon appears in the browser bar.
- [ ] **Favicon:** Verify the gold `'G'` emblem renders in the browser tab.
- [ ] **Lead Form:** Fill out a test lead (`Test Lead`, `9876543210`); check that the success toast appears.
- [ ] **WhatsApp Redirection:** Verify WhatsApp Web / App opens with pre-filled message text.
- [ ] **Google Sheet:** Verify the test lead row is added with timestamp.
- [ ] **Email Alert:** Check recipient inbox for email with subject `New Lead — Godrej Ivara Kharadi — Test Lead`.
- [ ] **Mobile Drawer:** Open the site on a mobile device; test the hamburger menu toggle.
- [ ] **Sticky Action Bar:** Test the `Call` and `WhatsApp` buttons from a physical phone.
