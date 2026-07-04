'use strict'

// Plain CommonJS export — no TypeScript loader required.
// defineConfig() is a runtime no-op (TypeScript type helper only), so
// exporting the object directly is equivalent.

module.exports = {
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE || 'shared',
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },

  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },

  modules: [
    {
      resolve: '@medusajs/event-bus-redis',
      options: { redisUrl: process.env.REDIS_URL },
    },
    {
      resolve: '@medusajs/cache-redis',
      options: { redisUrl: process.env.REDIS_URL },
    },
    {
      resolve: '@medusajs/workflow-engine-redis',
      options: { redis: { url: process.env.REDIS_URL } },
    },

    // ── PAYMENT PROVIDER ────────────────────────────────────────────────────
    // Option A – Stripe (official plugin):
    //   pnpm add @medusajs/payment-stripe
    //   Uncomment and set STRIPE_SECRET_KEY:
    //
    // {
    //   resolve: '@medusajs/payment-stripe',
    //   options: { apiKey: process.env.STRIPE_SECRET_KEY },
    // },
    //
    // Option B – CyberSource (custom provider):
    //   Implement AbstractPaymentProvider in src/modules/payment/index.ts
    //   Uncomment and set CYBERSOURCE_* env vars:
    //
    // {
    //   resolve: './src/modules/payment',
    //   options: {
    //     merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
    //     apiKeyId:   process.env.CYBERSOURCE_API_KEY_ID,
    //     secretKey:  process.env.CYBERSOURCE_SECRET_KEY,
    //   },
    // },
    // ────────────────���───────────────────────────────────────────────────────
  ],
}
