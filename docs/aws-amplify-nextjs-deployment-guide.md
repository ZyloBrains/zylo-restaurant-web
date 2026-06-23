# Zylo Restaurant Web Deployment Guide

## Next.js + GitHub + AWS Amplify + Cloudflare

---

# 1. Overview

This document describes the complete deployment process used to successfully deploy the **Zylo Restaurant Web** application to production.

### Technology Stack

* Frontend: Next.js
* Source Control: GitHub
* Hosting: AWS Amplify
* DNS & SSL: Cloudflare
* Backend API: Spring Boot
* Reverse Proxy: Nginx
* Database: PostgreSQL

---

# 2. Final Architecture

```text
Developer Machine
        │
        ▼
     GitHub
        │
        ▼
 AWS Amplify
        │
        ▼
fish-station.zylobrains.com
        │
        ▼
 Cloudflare DNS
        │
        ▼
   End Users


Backend

api.zylobrains.com
        │
        ▼
      Nginx
        │
        ▼
  Spring Boot API
        │
        ▼
    PostgreSQL
```

---

# 3. Prerequisites

Before deployment ensure:

* AWS Account
* Amplify Access
* GitHub Repository
* Cloudflare Domain Management Access
* Production Backend Available

Example:

```text
Frontend:
fish-station.zylobrains.com

Backend:
api.zylobrains.com

Admin:
admin.zylobrains.com
```

---

# 4. Push Code to GitHub

Verify application builds locally:

```bash
pnpm install
pnpm build
```

Commit and push:

```bash
git add .
git commit -m "prepare production deployment"
git push origin main
```

---

# 5. Create AWS Amplify Application

AWS Console

```text
Amplify
→ Create New App
→ Host Web App
→ GitHub
```

Select:

```text
Repository:
zylo-restaurant-web

Branch:
main
```

Click:

```text
Next
```

---

# 6. Amplify Build Failure (pnpm)

Initial deployment failed with:

```text
pnpm: command not found
```

Reason:

Amplify does not automatically enable pnpm.

---

# 7. Fix Amplify Build Settings

Build configuration:

```yaml
version: 1

frontend:
  phases:
    preBuild:
      commands:
        - corepack enable
        - corepack prepare pnpm@latest --activate
        - pnpm install --frozen-lockfile

    build:
      commands:
        - pnpm run build

  artifacts:
    baseDirectory: .next
    files:
      - '**/*'

  cache:
    paths:
      - node_modules/**/*
      - ~/.pnpm-store/**/*
```

Redeploy.

Deployment becomes successful.

---

# 8. Verify Amplify URL

Amplify generated:

```text
https://main.dp46xiypxtcbw.amplifyapp.com
```

Deployment status:

```text
Deployed
```

---

# 9. 404 Root Page Issue

Opening:

```text
https://main.dp46xiypxtcbw.amplifyapp.com
```

showed:

```text
404 Page Not Found
```

Reason:

Application only had:

```text
src/app/[slug]
```

No:

```text
src/app/page.tsx
```

Application was tenant-based.

Working URL:

```text
https://main.dp46xiypxtcbw.amplifyapp.com/fish-station
```

---

# 10. Tenant Middleware Design

Middleware:

```typescript
const ROOT_DOMAIN =
process.env.NEXT_PUBLIC_ROOT_DOMAIN;
```

Automatically converts:

```text
fish-station.zylobrains.com
```

into:

```text
/fish-station
```

Therefore production architecture should use:

```text
fish-station.zylobrains.com
```

instead of:

```text
web.zylobrains.com/fish-station
```

---

# 11. Amplify Environment Variables

Amplify

```text
App Settings
→ Environment Variables
```

Add:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.zylobrains.com/api/v1
NEXT_PUBLIC_ROOT_DOMAIN=zylobrains.com
```

Save and redeploy.

---

# 12. Configure Custom Domain

Amplify

```text
Hosting
→ Custom Domains
```

Add:

```text
zylobrains.com
```

Create subdomain:

```text
fish-station
```

Map:

```text
fish-station
→ main branch
```

Use:

```text
Amplify Managed Certificate
```

Save.

---

# 13. Cloudflare DNS Configuration

Amplify generated:

```text
Hostname:
fish-station

Type:
CNAME

Target:
xxxxxxxx.cloudfront.net
```

Cloudflare

```text
DNS
→ Add Record
```

Create:

```text
Type:
CNAME

Name:
fish-station

Target:
xxxxxxxx.cloudfront.net

Proxy:
DNS Only
```

Important:

```text
Gray Cloud
```

NOT:

```text
Orange Cloud
```

during verification.

---

# 14. SSL Activation

Amplify automatically generated SSL certificate.

Status progression:

```text
SSL Creation
→ SSL Configuration
→ Domain Activation
→ Available
```

Final URL:

```text
https://fish-station.zylobrains.com
```

---

# 15. CORS Issue Encountered

Frontend loaded.

Menu APIs failed.

Browser console:

```text
No Access-Control-Allow-Origin header
```

Requests blocked.

Example:

```text
https://api.zylobrains.com/api/v1/public/fish-station/items/list
```

---

# 16. Backend CORS Configuration

Spring Security already used:

```java
CorsConfigurationSource
```

Properties:

```yaml
frontend:
  url: ${FRONTEND_URL}

  dashboard:
    url: ${DASHBOARD_URL}
```

Environment:

```env
FRONTEND_URL=https://fish-station.zylobrains.com

DASHBOARD_URL=https://admin.zylobrains.com
```

Optional:

```env
SECURITY_CORS_ADDITIONAL_ORIGINS=http://localhost:3000
```

---

# 17. Backend API URL Issue

Frontend originally called:

```text
https://api.zylobrains.com/public/...
```

Correct endpoint:

```text
https://api.zylobrains.com/api/v1/public/...
```

Fix:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.zylobrains.com/api/v1
```

Redeploy Amplify.

---

# 18. Redeploy Frontend

Amplify:

```text
Deployments
→ Redeploy This Version
```

Or:

```bash
git push origin main
```

Automatic deployment triggered.

---

# 19. Final Working URLs

Restaurant Frontend

```text
https://fish-station.zylobrains.com
```

Admin

```text
https://admin.zylobrains.com
```

Backend API

```text
https://api.zylobrains.com
```

---

# 20. Production Checklist

## Amplify

* GitHub Connected
* pnpm Enabled
* Build Successful
* Environment Variables Configured
* Domain Connected
* SSL Active

## Cloudflare

* CNAME Added
* DNS Only Enabled
* SSL Verified

## Backend

* API Accessible
* CORS Configured
* Nginx Running
* Spring Boot Running

## Frontend

* Tenant Routing Working
* Menu Loading
* API Calls Successful

---

# 21. Final Status

Deployment completed successfully.

Working Production Environment:

```text
Frontend:
https://fish-station.zylobrains.com

Admin:
https://admin.zylobrains.com

API:
https://api.zylobrains.com
```

Status:

✅ GitHub Connected

✅ Amplify Deployed

✅ Cloudflare Configured

✅ SSL Active

✅ Tenant Routing Working

✅ Backend Connected

✅ CORS Fixed

✅ Production Ready

```
```
