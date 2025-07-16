import { GoogleMerchantApiClient, getMerchantId } from '../api-client.js'

export default defineEventHandler(async (event) => {
  try {
    const client = new GoogleMerchantApiClient(event)
    
    // Test getting accounts
    const accountsData = await client.getAccounts()
    const merchantId = await getMerchantId(event)
    
    // Test listing products (first 5)
    let productsData = null
    try {
      productsData = await client.listProducts(merchantId, 5)
    } catch (productError) {
      console.warn('Product listing failed:', productError.message)
    }
    
    return {
      success: true,
      message: 'Google Merchant API connection successful',
      merchantId,
      accountsCount: accountsData.resources?.length || 0,
      accounts: accountsData.resources?.map(acc => ({
        id: acc.id,
        name: acc.name,
        websiteUrl: acc.websiteUrl,
        accountType: acc.accountType
      })) || [],
      productsCount: productsData?.products?.length || 0,
      canManageProducts: !!productsData
    }
    
  } catch (error) {
    // If it's an authentication error, provide helpful guidance
    if (error.statusCode === 401) {
      return {
        success: false,
        authenticated: false,
        message: error.statusMessage,
        nextSteps: [
          'Visit /api/google-merchant/auth/authorize to authenticate',
          'Ensure you have set up Google OAuth credentials',
          'Check that your Google account has access to Google Merchant Center'
        ]
      }
    }
    
    throw error
  }
})
