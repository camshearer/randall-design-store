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

  // Custom Redis modules removed: the duplicate registration alongside
  // Medusa's built-in event_bus / cache modules causes a race in MikroORM
  // pool initialisation that triggers "Cannot read properties of undefined
  // (reading 'acquire')" during data-migration scripts and prevents the
  // api_key module's service from registering in the Awilix container.
  // Using all built-in defaults (in-memory event bus, cache, workflow engine)
  // until the correct v2.17.x Redis module keys are confirmed.
  modules: {

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
