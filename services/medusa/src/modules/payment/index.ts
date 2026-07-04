/**
 * Payment Provider – isolated module boundary
 *
 * This file is the integration point for a payment provider.
 * No live payment logic is implemented yet; the module boundary is kept
 * so you can add or swap providers without touching the rest of the app.
 *
 * ── Adding Stripe (recommended path) ──────────────────────────────────────
 *
 *   1. Install:
 *        pnpm --filter @randall-design/medusa add @medusajs/payment-stripe
 *
 *   2. Set env var:
 *        STRIPE_SECRET_KEY=sk_live_...   (or sk_test_... for staging)
 *
 *   3. Uncomment the Stripe block in services/medusa/medusa-config.ts
 *
 * ── Adding CyberSource (custom provider) ──────────────────────────────────
 *
 *   1. Install the CyberSource Node SDK:
 *        pnpm --filter @randall-design/medusa add cybersource-rest-client-node
 *
 *   2. Set env vars:
 *        CYBERSOURCE_MERCHANT_ID, CYBERSOURCE_API_KEY_ID, CYBERSOURCE_SECRET_KEY
 *
 *   3. Implement AbstractPaymentProvider below, following Medusa's docs:
 *        https://docs.medusajs.com/resources/commerce-modules/payment/provider
 *
 *   4. Uncomment the CyberSource block in services/medusa/medusa-config.ts
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Placeholder export so the module is importable before a provider is wired up.
export {}
