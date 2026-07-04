import { defineConfig, loadEnv } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    /**
     * PostgreSQL connection string.
     * Railway injects this automatically when you link a Postgres service.
     */
    databaseUrl: process.env.DATABASE_URL,

    /**
     * Redis connection string.
     * Railway injects this automatically when you link a Redis service.
     */
    redisUrl: process.env.REDIS_URL,

    workerMode: (process.env.MEDUSA_WORKER_MODE as 'shared' | 'worker' | 'server') ?? 'shared',

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
  },

  admin: {
    /**
     * Set to the public Railway URL of this service after first deploy.
     * e.g. https://randall-design-medusa.up.railway.app
     */
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },

  modules: [
    /**
     * Redis-backed event bus – replaces the default in-memory bus.
     * Required for distributed/worker setups; strongly recommended in production.
     */
    {
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },

    /**
     * Redis-backed cache – replaces the default in-memory cache.
     */
    {
      resolve: '@medusajs/cache-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },

    /**
     * Redis-backed workflow engine – required when workerMode is 'worker'.
     */
    {
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },

    /**
     * ──────────────────────────────────────────────────────────────────────
     * PAYMENT PROVIDER — isolated for easy swapping
     * ──────────────────────────────────────────────────────────────────────
     *
     * Option A – Stripe (official plugin):
     *   pnpm --filter @randall-design/medusa add @medusajs/payment-stripe
     *   Then uncomment the block below and set STRIPE_SECRET_KEY.
     *
     * {
     *   resolve: '@medusajs/payment-stripe',
     *   options: {
     *     apiKey: process.env.STRIPE_SECRET_KEY,
     *   },
     * },
     *
     * Option B – CyberSource (custom provider):
     *   Implement the AbstractPaymentProvider in src/modules/payment/
     *   (see that directory for the stub), then uncomment:
     *
     * {
     *   resolve: './src/modules/payment',
     *   options: {
     *     merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
     *     apiKeyId: process.env.CYBERSOURCE_API_KEY_ID,
     *     secretKey: process.env.CYBERSOURCE_SECRET_KEY,
     *   },
     * },
     * ──────────────────────────────────────────────────────────────────────
     */
  ],
})
