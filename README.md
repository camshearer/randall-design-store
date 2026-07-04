# Randall Design Store

pnpm monorepo powering the Randall Design eCommerce platform.

| Package | Stack | Hosting |
|---|---|---|
| `apps/storefront` | Astro 5, SSR | Netlify |
| `services/medusa` | Medusa v2 | Railway |

---

## Project Structure

```
randall-design-store/
├── apps/
│   └── storefront/          # Astro storefront (Netlify)
│       ├── src/lib/medusa.ts # Pre-configured Medusa JS SDK
│       └── src/pages/
└── services/
    └── medusa/              # Medusa v2 backend (Railway)
        ├── medusa-config.ts  # All provider/CORS config lives here
        └── src/modules/
            └── payment/     # Isolated payment module boundary
```

---

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- Docker (recommended for local Postgres + Redis)
- Railway CLI (optional): `npm install -g @railway/cli`

---

## Local Development

```bash
# 1. Install all workspace dependencies from the repo root
pnpm install

# 2. Copy and fill in env files
cp services/medusa/.env.example services/medusa/.env
cp apps/storefront/.env.example  apps/storefront/.env

# 3. Start Postgres + Redis (Docker example)
docker run -d --name pg    -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16-alpine
docker run -d --name redis -p 6379:6379 redis:7-alpine

# 4. Run Medusa migrations
pnpm medusa:migrate

# 5. Start Medusa dev server  (http://localhost:9000)
pnpm dev:medusa

# 6. In a separate terminal – start Astro storefront (http://localhost:4321)
pnpm dev:storefront
```

---

## Railway Deployment (Medusa backend)

### 1 – Create a Railway project

Log in at railway.app → **New Project** → **Empty Project**.

### 2 – Add PostgreSQL

Inside the project → **New** → **Database** → **PostgreSQL**.  
Railway automatically sets `DATABASE_URL` in your service environment.

### 3 – Add Redis

**New** → **Database** → **Redis**.  
Railway automatically sets `REDIS_URL`.

### 4 – Add the GitHub repo

**New** → **GitHub Repo** → select `camshearer/randall-design-store`.

### 5 – Configure the service

In the service settings (not the database plugins):

| Setting | Value |
|---|---|
| **Root Directory** | *(leave blank – use repo root)* |
| **Build Command** | `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm --filter @randall-design/medusa build` |
| **Start Command** | `pnpm --filter @randall-design/medusa migrate && pnpm --filter @randall-design/medusa start` |

> The `railway.toml` at `services/medusa/railway.toml` sets these automatically
> if Railway picks it up, but the dashboard values take precedence.

### 6 – Set environment variables

Add these in **Variables** (Railway will already have injected DATABASE_URL and REDIS_URL):

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `openssl rand -base64 48` |
| `COOKIE_SECRET` | `openssl rand -base64 48` |
| `MEDUSA_BACKEND_URL` | Your Railway service URL (set after first deploy) |
| `STORE_CORS` | Your Netlify URL, e.g. `https://randall-design.netlify.app` |
| `ADMIN_CORS` | Your Railway URL, e.g. `https://randall-design-medusa.up.railway.app` |
| `AUTH_CORS` | Both of the above, comma-separated |
| `MEDUSA_WORKER_MODE` | `shared` |

### 7 – First deploy

Click **Deploy**. Watch the build logs.  
After the server is healthy, copy the Railway URL and update `MEDUSA_BACKEND_URL` in Variables, then redeploy.

### 8 – Create a publishable API key

Open `<MEDUSA_BACKEND_URL>/app` → **Settings** → **API Keys** → **Create publishable key**.  
You will need this key for the storefront (`PUBLIC_MEDUSA_PUBLISHABLE_KEY`).

---

## Netlify Deployment (Astro storefront)

1. Log in at app.netlify.com → **Add new site** → **Import an existing project** → GitHub.
2. Select `camshearer/randall-design-store`.
3. Netlify will read `apps/storefront/netlify.toml` for build config automatically.
4. Add environment variables under **Site configuration → Environment variables**:

| Variable | Value |
|---|---|
| `PUBLIC_MEDUSA_BACKEND_URL` | Your Railway service URL |
| `PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Key created in step 8 above |

5. **Deploy site**.

---

## Adding a Payment Provider

Payment logic is isolated in `services/medusa/src/modules/payment/`.  
The integration point in `medusa-config.ts` has commented-out blocks for both Stripe and CyberSource.

### Stripe (quickest path)

```bash
pnpm --filter @randall-design/medusa add @medusajs/payment-stripe
```

Uncomment the Stripe block in `services/medusa/medusa-config.ts` and set:
- `STRIPE_SECRET_KEY=sk_live_...`

### CyberSource (custom provider)

1. Implement `AbstractPaymentProvider` inside `services/medusa/src/modules/payment/index.ts`.  
   Docs: https://docs.medusajs.com/resources/commerce-modules/payment/provider
2. Uncomment the CyberSource block in `medusa-config.ts`.
3. Set `CYBERSOURCE_MERCHANT_ID`, `CYBERSOURCE_API_KEY_ID`, `CYBERSOURCE_SECRET_KEY`.

---

## Scripts Reference

| Command | What it does |
|---|---|
| `pnpm dev:medusa` | Medusa dev server with hot reload |
| `pnpm dev:storefront` | Astro dev server |
| `pnpm medusa:build` | Production build of Medusa |
| `pnpm medusa:start` | Start production Medusa server |
| `pnpm medusa:migrate` | Run pending DB migrations |
| `pnpm medusa:seed` | Run database seed script |
| `pnpm build` | Build all workspace packages |
