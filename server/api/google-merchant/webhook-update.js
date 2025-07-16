import { transformProductForGoogleMerchant, validateGoogleMerchantProduct } from './transform-product.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const productId = body.resource?.id || body.productId
    
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }
    
    const { publicUrl } = useRuntimeConfig()
    const sanity = useSanity()
    
    // Fetch the updated product from Sanity
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
    
    const sanityId = `printifyProduct-${productId}`
    const sanityProduct = await sanity.client.fetch(productQuery, { id: sanityId })
    
    if (!sanityProduct) {
      return {
        success: false,
        message: `Product not found in Sanity: ${sanityId}`,
        productId,
        action: 'skip'
      }
    }
    
    // Skip if product is deleted or not visible
    if (!sanityProduct.store?.isVisible || sanityProduct.store?.isDeleted) {
      return {
        success: true,
        message: 'Product is not visible or deleted - skipping Google Merchant sync',
        productId,
        action: 'skip'
      }
    }
    
    // Transform to Google Merchant format
    const googleMerchantProduct = transformProductForGoogleMerchant(sanityProduct, {
      baseUrl: publicUrl,
      currency: 'NZD'
    })
    
    // Validate the transformed product
    const validation = validateGoogleMerchantProduct(googleMerchantProduct)
    
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Product validation failed for Google Merchant',
        productId,
        errors: validation.errors,
        action: 'validation_failed'
      }
    }
    
    // TODO: Implement actual Google Merchant API call here
    // const apiResult = await sendToGoogleMerchant(googleMerchantProduct)
    
    return {
      success: true,
      message: `Product ready for Google Merchant sync: ${sanityProduct.store.title}`,
      productId,
      sanityId,
      title: sanityProduct.store.title,
      imageSource: sanityProduct.featureImage?.asset?.url ? 'sanity' : 'printify',
      action: 'ready_for_sync',
      note: 'Google Merchant API integration pending - webhook integration ready'
    }
    
  } catch (error) {
    return {
      success: false,
      message: error.message,
      productId: body.resource?.id || 'unknown',
      action: 'error'
    }
  }
})
