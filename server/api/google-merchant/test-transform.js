import { transformProductForGoogleMerchant, validateGoogleMerchantProduct } from './transform-product.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const productId = query.productId
    
    const { publicUrl } = useRuntimeConfig()
    const sanity = useSanity()
    
    let sanityProduct
    
    if (productId) {
      // Get specific product by ID
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
      sanityProduct = await sanity.client.fetch(productQuery, { id: productId })
    } else {
      // Get first available product for testing
      const productQuery = `*[_type == "printify.product" && !store.isDeleted && store.isVisible][0] {
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
      sanityProduct = await sanity.client.fetch(productQuery)
    }
    
    if (!sanityProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: productId ? `Product not found: ${productId}` : 'No products available for testing'
      })
    }
    
    // Transform to Google Merchant format
    const googleMerchantProduct = transformProductForGoogleMerchant(sanityProduct, {
      baseUrl: publicUrl,
      currency: 'NZD'
    })
    
    // Validate the transformed product
    const validation = validateGoogleMerchantProduct(googleMerchantProduct)
    
    return {
      productId: sanityProduct._id,
      sanityProduct,
      googleMerchantProduct,
      validation,
      success: validation.isValid,
      message: validation.isValid ? 'Product transformation successful' : 'Product has validation errors'
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
