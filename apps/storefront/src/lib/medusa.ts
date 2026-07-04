import Medusa from '@medusajs/js-sdk'

/**
 * Pre-configured Medusa JS SDK instance.
 * Import `sdk` in your Astro pages or API routes to call the Store API.
 *
 * Example:
 *   const { products } = await sdk.store.product.list()
 */
export const sdk = new Medusa({
  baseUrl: import.meta.env.PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000',
  publishableKey: import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
