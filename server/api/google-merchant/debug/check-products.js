import { GoogleMerchantApiClient, getMerchantId } from '../api-client.js'

export default defineEventHandler(async (event) => {
  try {
    const client = new GoogleMerchantApiClient(event)
    const merchantId = await getMerchantId(event)
    
    // Get existing products from Google Merchant Center
    const productsData = await client.listProducts(merchantId, 50)
    
    // Get merchant account details
    const accountsData = await client.getAccounts()
    const merchantAccount = accountsData.accounts?.find(
      acc => acc.name.includes(merchantId)
    )
    
    return {
      success: true,
      merchantId,
      merchantAccount: merchantAccount ? {
        name: merchantAccount.displayName,
        type: merchantAccount.accountType,
        accountId: merchantAccount.name
      } : null,
      productsInGoogleMerchant: {
        count: productsData.products?.length || 0,
        products: productsData.products?.slice(0, 10).map(product => ({
          id: product.name,
          offerId: product.offerId,
          title: product.title,
          status: product.status,
          availability: product.availability
        })) || []
      },
      debugging: {
        hasProducts: (productsData.products?.length || 0) > 0,
        accountVerified: !!merchantAccount,
        apiWorking: true
      }
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode,
      debugging: {
        apiWorking: false,
        errorType: error.statusCode === 401 ? 'authentication' : 'api_error'
      }
    }
  }
})
