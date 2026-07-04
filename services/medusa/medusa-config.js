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
    // Disabled: medusa build creates the admin in .medusa/server/ but Railpack's
    // runtime image doesn't include that directory, so medusa start can't find
    // index.html. The Admin and Store REST APIs remain fully functional.
    disable: true,
  },

  // Object format required — Medusa v2 calls Object.keys(modules) to validate
  // names. An array would produce index keys "0","1",... which fail validation.
  modules: {
    eventBus: {
      resolve: '@medusajs/event-bus-redis',
      options: { redisUrl: process.env.REDIS_URL },
    },
    cacheService: {
      resolve: '@medusajs/cache-redis',
      options: { redisUrl: process.env.REDIS_URL },
    },
    // @medusajs/workflow-engine-redis omitted.
    // Both "workflowEngine" and "workflowEngineModule" keys crash with
    // "Could not resolve 'sharedContainer'" in v2.17.2 — the workflow engine
    // is bootstrapped before the main container is fully initialised so
    // sharedContainer is never injected. Using the built-in in-memory engine.

    // ── PAYMENT PROVIDER ──────────────────────────────────────────────────
    // Option A – Stripe (official plugin):
    //   pnpm add @medusajs/payment-stripe  then set STRIPE_SECRET_KEY
    //
    // payment: {
    //   resolve: '@medusajs/payment-stripe',
    //   options: { apiKey: process.env.STRIPE_SECRET_KEY },
    // },
    //
    // Option B – CyberSource (custom provider):
    //   Implement AbstractPaymentProvider in src/modules/payment/index.ts
    //   then set CYBERSOURCE_* env vars
    //
    // payment: {
    //   resolve: './src/modules/payment',
    //   options: {
    //     merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
    //     apiKeyId:   process.env.CYBERSOURCE_API_KEY_ID,
    //     secretKey:  process.env.CYBERSOURCE_SECRET_KEY,
    //   },
    // },
    // ─────────────────────────────────────────────────────────────────────
  },
}
