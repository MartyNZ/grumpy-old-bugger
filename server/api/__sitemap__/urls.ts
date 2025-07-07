import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

// Import the existing query functions
import { qryAllProducts, qryAllPrintifyCollections } from '~/queries/printify.js'
import { qryAllArticles, qryAllCategories } from '~/queries/articles.js'
import { qryAuthors } from '~/queries/contacts.js'
import { qryAllLivePromotions } from '~/queries/promotions.js'

export default defineSitemapEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sanity = useSanity()
  
  // Define simple queries for sitemap data
  const qryAllProductSlugs = `
    *[_type == "printify.product" && defined(slug.current) && store.isVisible && !store.isDeleted] {
      "slug": slug.current,
      _updatedAt
    }
  `
  
  const qryAllArticleSlugs = `
    *[_type == "article" && defined(slug.current) && draft != true && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")] {
      "slug": slug.current,
      _updatedAt
    }
  `
  
  const qryAllPageSlugs = `
    *[_type == "page" && defined(slug.current) && isActive] {
      "slug": slug.current,
      _updatedAt
    }
  `
  
  const qryAllAuthorSlugs = `
    *[_type == "contact" && defined(slug.current) && _id in *[_type == "article"].authors[]._ref] {
      "slug": slug.current,
      _updatedAt
    }
  `
  
  const qryAllProductCollectionSlugs = `
    *[_type == "printify.collection" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `
  
  const qryAllArticleCategorySlugs = `
    *[_type == "article.category" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `
  
  const qryAllPromotionSlugs = `
    *[_type == "promotion" && defined(slug.current) && isActive] {
      "slug": slug.current,
      _updatedAt
    }
  `
  
  // Fetch all dynamic content from Sanity
  const [products, articles, pages, authors, productCollections, articleCollections, promotions] = await Promise.all([
    sanity.fetch<{ slug: string, _updatedAt: string }[]>(qryAllProductSlugs),
    sanity.fetch<{ slug: string, _updatedAt: string }[]>(qryAllArticleSlugs),
    sanity.fetch<{ slug: string, _updatedAt: string }[]>(qryAllPageSlugs),
    sanity.fetch<{ slug: string, _updatedAt: string }[]>(qryAllAuthorSlugs),
    sanity.fetch<{ slug: string, _updatedAt: string }[]>(qryAllProductCollectionSlugs),
    sanity.fetch<{ slug: string, _updatedAt: string }[]>(qryAllArticleCategorySlugs),
    sanity.fetch<{ slug: string, _updatedAt: string }[]>(qryAllPromotionSlugs),
  ])

  const urls: SitemapUrl[] = []

  // Add product URLs
  products.forEach(product => {
    urls.push({
      loc: `/products/${product.slug}`,
      lastmod: product._updatedAt,
      changefreq: 'weekly',
      priority: 0.8,
    })
  })

  // Add article URLs
  articles.forEach(article => {
    urls.push({
      loc: `/the-rant-files/${article.slug}`,
      lastmod: article._updatedAt,
      changefreq: 'weekly',
      priority: 0.7,
    })
  })

  // Add page URLs
  pages.forEach(page => {
    urls.push({
      loc: `/${page.slug}`,
      lastmod: page._updatedAt,
      changefreq: 'monthly',
      priority: 0.9,
    })
  })

  // Add author URLs
  authors.forEach(author => {
    urls.push({
      loc: `/authors/${author.slug}`,
      lastmod: author._updatedAt,
      changefreq: 'monthly',
      priority: 0.5,
    })
  })

  // Add product collection URLs
  productCollections.forEach(collection => {
    urls.push({
      loc: `/products/collections/${collection.slug}`,
      lastmod: collection._updatedAt,
      changefreq: 'weekly',
      priority: 0.6,
    })
  })

  // Add article collection URLs
  articleCollections.forEach(collection => {
    urls.push({
      loc: `/the-rant-files/collections/${collection.slug}`,
      lastmod: collection._updatedAt,
      changefreq: 'weekly',
      priority: 0.6,
    })
  })

  // Add promotion URLs
  promotions.forEach(promotion => {
    urls.push({
      loc: `/promotions/${promotion.slug}`,
      lastmod: promotion._updatedAt,
      changefreq: 'daily',
      priority: 0.9,
    })
  })

  return urls
})
