import { transformProductForGoogleMerchant, validateGoogleMerchantProduct } from './transform-product.js'
import { GoogleMerchantApiClient, getMerchantId } from './api-client.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      productIds = [], 
      batchSize = 10, 
      dryRun = true,
      forceSync = false 
    } = body
    
    const { publicUrl } = useRuntimeConfig()
    const sanity = useSanity()
    
    // Query for products to sync - using grumpy-old project dataset
    let productQuery
    if (productIds.length > 0) {
      productQuery = `*[_type == "printify.product" && _id in $ids] {
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
    } else {
      // Sync all visible, non-deleted products
      productQuery = `*[_type == "printify.product" && !store.isDeleted && store.isVisible] {
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
      } | order(_createdAt desc)`
    }
    
    const sanityProducts = await sanity.client.fetch(productQuery, { 
      ids: productIds 
    })
    
    if (!sanityProducts?.length) {
      return {
        message: 'No products found to sync',
        productCount: 0,
        results: []
      }
    }
    
    const results = []
    const errors = []
    
    // Initialize Google Merchant API client if not dry run
    let client = null
    let merchantId = null
    if (!dryRun) {
      try {
        client = new GoogleMerchantApiClient(event)
        merchantId = await getMerchantId(event)
      } catch (apiError) {
        throw createError({
          statusCode: 401,
          statusMessage: `Google Merchant API setup failed: ${apiError.message}`
        })
      }
    }
    
    // Process products in batches
    for (let i = 0; i < sanityProducts.length; i += batchSize) {
      const batch = sanityProducts.slice(i, i + batchSize)
      
      for (const product of batch) {
        try {
          // Transform product
          const googleMerchantProduct = transformProductForGoogleMerchant(product, {
            baseUrl: publicUrl,
            currency: 'NZD'
          })
          
          // Validate
          const validation = validateGoogleMerchantProduct(googleMerchantProduct)
          
          if (!validation.isValid) {
            errors.push({
              productId: product._id,
              printifyId: product.store.productId,
              title: product.store.title,
              errors: validation.errors
            })
            continue
          }
          
          const result = {
            productId: product._id,
            sanityId: product._id,
            printifyId: product.store.productId,
            title: product.store.title,
            status: 'ready',
            imageSource: product.featureImage?.asset?.url ? 'sanity' : 'printify',
            googleMerchantProduct: dryRun ? googleMerchantProduct : null
          }
          
          if (!dryRun) {
            try {
              // Insert or update product in Google Merchant Center
              const apiResult = await client.insertProduct(merchantId, googleMerchantProduct)
              result.status = 'synced'
              result.googleProductId = apiResult.name
              result.note = 'Successfully synced to Google Merchant Center'
            } catch (apiError) {
              result.status = 'api_error'
              result.error = apiError.message
              result.note = 'Failed to sync to Google Merchant Center'
            }
          }
          
          results.push(result)
          
        } catch (error) {
          errors.push({
            productId: product._id,
            printifyId: product.store?.productId,
            title: product.store?.title || 'Unknown',
            error: error.message
          })
        }
      }
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < sanityProducts.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return {
      message: `Processed ${sanityProducts.length} products for Grumpy Old Bugger`,
      dryRun,
      productCount: sanityProducts.length,
      successCount: results.length,
      errorCount: errors.length,
      results: dryRun ? results : results.map(r => ({ 
        productId: r.productId, 
        printifyId: r.printifyId,
        title: r.title, 
        status: r.status,
        imageSource: r.imageSource
      })),
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        withSanityImages: results.filter(r => r.imageSource === 'sanity').length,
        withPrintifyImages: results.filter(r => r.imageSource === 'printify').length
      }
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
