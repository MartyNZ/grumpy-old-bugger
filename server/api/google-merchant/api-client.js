import { makeAuthenticatedRequest } from './auth/utils.js'

/**
 * Google Content API for Shopping client for product management
 */

const CONTENT_API_BASE = 'https://shoppingcontent.googleapis.com/content/v2.1'

export class GoogleMerchantApiClient {
  constructor(event) {
    this.event = event
  }

  async getAccounts() {
    // The accounts endpoint lists all Merchant Center accounts the user has access to
    const response = await makeAuthenticatedRequest(
      `${CONTENT_API_BASE}/accounts`,
      { method: 'GET' },
      this.event
    )
    return await response.json()
  }

  async insertProduct(merchantId, product) {
    const response = await makeAuthenticatedRequest(
      `${CONTENT_API_BASE}/${merchantId}/products`,
      {
        method: 'POST',
        body: JSON.stringify(this.formatForContentApi(product))
      },
      this.event
    )
    return await response.json()
  }

  async updateProduct(merchantId, productId, product) {
    const response = await makeAuthenticatedRequest(
      `${CONTENT_API_BASE}/${merchantId}/products/${productId}`,
      {
        method: 'PUT',
        body: JSON.stringify(this.formatForContentApi(product))
      },
      this.event
    )
    return await response.json()
  }

  async deleteProduct(merchantId, productId) {
    const response = await makeAuthenticatedRequest(
      `${CONTENT_API_BASE}/${merchantId}/products/${productId}`,
      { method: 'DELETE' },
      this.event
    )
    return response.status === 204
  }

  async listProducts(merchantId, maxResults = 25, pageToken = null) {
    const params = new URLSearchParams({ maxResults: maxResults.toString() })
    if (pageToken) params.append('pageToken', pageToken)
    
    const response = await makeAuthenticatedRequest(
      `${CONTENT_API_BASE}/${merchantId}/products?${params}`,
      { method: 'GET' },
      this.event
    )
    return await response.json()
  }

  formatForContentApi(product) {
    // Convert our product format to Google Content API format
    return {
      offerId: product.id,
      title: product.title,
      description: product.description,
      link: product.link,
      imageLink: product.image_link,
      additionalImageLinks: product.additional_image_link || [],
      availability: product.availability,
      price: {
        value: product.price.replace(/[^\d.]/g, ''), // Remove currency symbol
        currency: product.price.match(/[A-Z]{3}/)?.[0] || 'NZD'
      },
      condition: product.condition,
      brand: product.brand,
      gtin: product.gtin,
      mpn: product.mpn,
      productTypes: product.product_type ? [product.product_type] : [],
      googleProductCategory: product.google_product_category,
      customLabel0: product.custom_label_0,
      customLabel1: product.custom_label_1,
      targetCountry: 'NZ',
      contentLanguage: 'en',
      channel: 'online'
    }
  }
}

export async function getMerchantId(event) {
  const client = new GoogleMerchantApiClient(event)
  const accounts = await client.getAccounts()
  
  // Find the first merchant account (not MCA)
  const merchantAccount = accounts.resources?.find(
    account => account.accountType !== 'MULTI_CLIENT'
  )
  
  if (!merchantAccount) {
    throw new Error('No merchant account found. Please ensure you have access to a Google Merchant Center account.')
  }
  
  // Return the account ID directly
  return merchantAccount.id
}
