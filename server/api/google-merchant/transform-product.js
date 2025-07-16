/**
 * Transform Sanity product data to Google Merchant format
 */

export function transformProductForGoogleMerchant(sanityProduct, config = {}) {
  if (!sanityProduct?.store) {
    throw new Error('Invalid product: missing store data')
  }

  const { store, featureImage, defaultImageUrl, slug, details } = sanityProduct
  const { baseUrl = 'https://grumpyoldbugger.store', currency = 'NZD' } = config

  // Priority: featureImage.asset.url > defaultImageUrl
  const getImageUrl = () => {
    if (featureImage?.asset?.url) {
      return featureImage.asset.url
    }
    return defaultImageUrl
  }

  // Get the default or first available variant
  const defaultVariant = store.variants?.find(v => v.isDefault) || store.variants?.[0]
  
  if (!defaultVariant) {
    throw new Error(`No variants found for product ${store.productId}`)
  }

  // Get additional images from variants
  const additionalImages = store.variants
    ?.flatMap(v => v.variantImages?.map(img => img.src))
    ?.filter(Boolean)
    ?.slice(0, 10) // Google allows max 10 additional images

  return {
    // Required fields
    id: store.productId,
    title: store.title,
    description: store.description || 'No description available',
    link: slug?.current ? `${baseUrl}/products/${slug.current}` : `${baseUrl}/products/${store.productId}`,
    image_link: getImageUrl(),
    availability: defaultVariant.isAvailable && store.isVisible ? 'in stock' : 'out of stock',
    price: `${defaultVariant.price} ${currency}`,
    condition: 'new',
    
    // Optional but recommended fields
    brand: details?.manufacturer?.name || 'Grumpy Old Bugger',
    gtin: defaultVariant.sku || undefined,
    mpn: defaultVariant.id || undefined,
    product_type: store.tags || undefined,
    google_product_category: 'Apparel & Accessories', // TODO: Map to specific categories
    
    // Additional images
    ...(additionalImages?.length > 0 && { additional_image_link: additionalImages }),
    
    // Inventory
    quantity: defaultVariant.quantity || 0,
    
    // Custom labels for tracking
    custom_label_0: store.blueprintId,
    custom_label_1: details?.theme?.name || undefined,
  }
}

export function validateGoogleMerchantProduct(product) {
  const errors = []
  
  // Required fields validation
  if (!product.id) errors.push('Missing required field: id')
  if (!product.title) errors.push('Missing required field: title')
  if (!product.description) errors.push('Missing required field: description')
  if (!product.link) errors.push('Missing required field: link')
  if (!product.image_link) errors.push('Missing required field: image_link')
  if (!product.availability) errors.push('Missing required field: availability')
  if (!product.price) errors.push('Missing required field: price')
  if (!product.condition) errors.push('Missing required field: condition')
  
  // URL validation
  try {
    new URL(product.image_link)
  } catch {
    errors.push('Invalid image_link URL')
  }
  
  try {
    new URL(product.link)
  } catch {
    errors.push('Invalid link URL')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
