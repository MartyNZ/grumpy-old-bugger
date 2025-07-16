import { GoogleMerchantApiClient, getMerchantId } from '../api-client.js'
import { transformProductForGoogleMerchant, validateGoogleMerchantProduct } from '../transform-product.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const productId = query.productId || 'printifyProduct-6674e447a0805c60b70bd3a0'
    
    const { publicUrl } = useRuntimeConfig()
    const sanity = useSanity()
    
    // Get the test product
    const productQuery = `*[_id == $id][0] {
      _id,
      slug,
      featureImage {
        asset-> {
          url
        }
      },
      defaultImageUrl,
      store,
      details-> {
        manufacturer-> {
          name
        },
        theme-> {
          name
        }
      }
    }`
    
    const sanityProduct = await sanity.client.fetch(productQuery, { id: productId })
    
    if (!sanityProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: `Product not found: ${productId}`
      })
    }
    
    // Transform the product
    const googleMerchantProduct = transformProductForGoogleMerchant(sanityProduct, {
      baseUrl: publicUrl,
      currency: 'NZD'
    })
    
    // Validate the product
    const validation = validateGoogleMerchantProduct(googleMerchantProduct)
    
    if (!validation.isValid) {
      return {
        success: false,
        step: 'validation',
        errors: validation.errors,
        product: googleMerchantProduct
      }
    }
    
    // Try to sync to Google Merchant Center
    const client = new GoogleMerchantApiClient(event)
    const merchantId = await getMerchantId(event)
    
    try {
      const apiResult = await client.insertProduct(merchantId, googleMerchantProduct)
      
      return {
        success: true,
        step: 'api_success',
        sanityProduct: {
          id: sanityProduct._id,
          title: sanityProduct.store.title
        },
        googleMerchantProduct,
        apiResult: {
          name: apiResult.name,
          offerId: apiResult.offerId,
          status: apiResult.status
        },
        message: 'Product successfully uploaded to Google Merchant Center'
      }
      
    } catch (apiError) {
      return {
        success: false,
        step: 'api_error',
        sanityProduct: {
          id: sanityProduct._id,
          title: sanityProduct.store.title
        },
        googleMerchantProduct,
        apiError: {
          message: apiError.message,
          statusCode: apiError.statusCode,
          details: apiError.data
        },
        troubleshooting: [
          'Check if your Google Merchant Center account is verified',
          'Ensure your account has products approval enabled',
          'Verify the product data meets Google\'s requirements',
          'Check if the merchant account is in good standing'
        ]
      }
    }
    
  } catch (error) {
    return {
      success: false,
      step: 'setup_error',
      error: error.message,
      statusCode: error.statusCode
    }
  }
})
