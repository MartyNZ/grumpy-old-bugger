export const qryAllPrintifyCollections = groq`
  *[_type=='printify.collection'][]{
  _id,
  title,
  description,
  'imageUrl':image.asset->url,
  'imageId':image.asset->_id,
  'slug':slug.current,
  rules
}
`;

export const qryPrintifyCollectionBySlug = groq`
  *[_type=='printify.collection' && slug.current == $slug][0]{
    _id,
    title,
    description,
    'slug':slug.current,
    rules,
    'imageUrl':image.asset->url
  }
`;

export const qryPrintifyCollectionByTag = groq`
  *[_type=='printify.collection' && tags match $tag]
`;

export const qryPrintifyCollectionNavigation = groq`
*[_type=="printify.collectionNavigation"][0]{
    _id,
    title,
    'slug':slug.current,
    printifyCollectionNavGroup[]->{
        _id,
      title,
      'slug':slug.current,
      parentCollection->{
        _id,
        title,
        description,
        'slug':slug.current,
        image{
        'url':asset->url,
        'assetId':asset->_id,
        rules
        }
      },
      childCollections[]->{
        _id,
        title,
        description,
        'slug':slug.current,
        image{
        'url':asset->url,
        'assetId':asset->_id,
        rules
        }
      },
    }
  }
`;
export const qryAllProducts = groq`
  *[_type == "printify.product" && store.isVisible && !store.isDeleted][]{
    _id,
    _createdAt,
    _updatedAt,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    'theme': design->theme->{
      _id,
      title,
      'slug': slug.current,
      image{
        'assetId': asset->_id,
        'url':asset->url
      },
    },
    'slug':slug.current,
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc)
`;
export const qryLatestProducts = groq`
  *[_type == "printify.product" && store.isVisible && !store.isDeleted]{
    _id,
    _createdAt,
    defaultImageUrl,
    featureImage,
    'slug':slug.current,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc) [0...4]
  `;
export const qryAllProductsByCollection = groq`
  *[_type == "printify.product" && store.$relation $condition "$selectedTag" && store.isVisible && !store.isDeleted]{
    _id,
    _createdAt,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    'slug':slug.current,
    'featureImageUrl':featureImage.asset->url,
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc)
`;

export const qryProductsByCollections = groq`
  *[_type == "printify.product" && store.$relation $condition "$selectedTag" && store.isVisible && !store.isDeleted]{
    _id,
    _createdAt,
    defaultImageUrl,
    featureImage,
    'slug':slug.current,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc)
`;
export const qryProductBySlug = groq`
  *[_type == "printify.product" && store.isVisible && !store.isDeleted && slug.current == $slug][0]{
    _id,
    _createdAt,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url,
    },
    'slug':slug.current,
    details->{
      productFeatures[]{
        title,
        body
      },
      productSizes,
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      blueprintId,
      shopId,
      printProviderId,
      title,
      productId,
      tags,
      description,
      options,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  }
`;

export const qryProductsByTags = groq`
  *[_type == 'printify.product' && store.tags match $collection && store.tags match $sub && store.isVisible && !store.isDeleted][]{
    _id,
    _createdAt,
    defaultImageUrl,
    'slug':slug.current,
    'theme': design->theme->{
      _id,
      title,
      'slug': slug.current,
      image{
        'assetId': asset->_id,
        'url':asset->url
      },
    },
    featureImage{
      'assetId': asset->_id,
      'url':asset->url,
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc)
`;
export const qryProductsByTag = groq`
  *[_type == "printify.product" && store.isVisible && !store.isDeleted && store.tags match $tag][]{
    _id,
    _createdAt,
    defaultImageUrl,
    'slug':slug.current,
    'theme': design->theme->{
      _id,
      title,
      'slug': slug.current,
      image{
        'assetId': asset->_id,
        'url':asset->url
      },
    },
    featureImage{
      'assetId': asset->_id,
      'url':asset->url,
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc)
`;
export const qryProductById = groq`
  *[_type=='printify.product' && store.productId == $id && store.isVisible && !store.isDeleted][0]{
    _id,
    _createdAt,
    _updatedAt,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    featured,
    'slug':slug.current,
    'featureImageUrl':featureImage.asset->url,
    themes,
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    details,
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }
    },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  }
`;

export const qryProductThemes = groq`
  *[_type=='productTheme' && isActive][]{
    _id,
    title,
    'imageUrl':image.asset->url,
    image{
      'assetId':asset->_id,
      'url': asset->url,
    },
    'slug':slug.current,
    description,
    'designs':*[_type=='productDesign' && references(^._id)]{
      _id,
      title,
      'slug':slug.current,
      image{
        'assetId': asset->_id,
        'url': asset->url
      }
    }
  } | order(_createdAt desc)
`;
export const qryAllProductsByTheme = groq`
*[_type=='productTheme' && isActive][]{
  title,
  'slug':slug.current,
  'imageUrl':image.asset->url,
  description,
  'products':*[_type == 'printify.product' && references(^._id)]{
    _id,
    defaultImage,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    'slug':slug.current,
    store{
      title,
      productId,
      tags,
    }
  }
} | order(_createdAt desc)
`;

export const qryProductsByTheme = groq`
*[_type=='productDesign' && theme.slug.current == $slug][0]{
  _id,
  title,
  description,
  image{
    'assetId': asset->_id,
    'url': asset->url
  },
  theme[]->{
    _id,
    title,
    'slug': slug.current,
  },
  'slug':slug.current,
  'products':*[_type == 'printify.product' && references(^._id)]{
    _id,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    'slug':slug.current,
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
      price
      }|order(price asc)[0]
    }
  },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
}
`;
export const qryAllProductDesigns = groq`
  *[_type=='productDesign'][]{
    _id,
    title,
  theme->{
    title,
    description
    },
    image{
      'assetId': asset->_id,
      'url': asset->url
    },
    'slug':slug.current
  }
`;

export const qryProductsByDesign = groq`
*[_type=='productDesign' && slug.current == $slug][0]{
  _id,
  title,
  theme->{
    title,
    description
  },
  image{
    'assetId': asset->_id,
    'url': asset->url
  },
  'slug':slug.current,
  'products':*[_type == 'printify.product' && references(^._id)]{
    _id,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    'slug':slug.current,
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
      price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'siteWide'
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
        useSocialImage,
        socialImage{
          'assetId': asset->_id,
          'url': asset->url
        },
      cta,
      discount,
      promoStart,
      promoEnd,
      // 'timeRemaining'
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  },
}
`;

export const qryFeaturedProducts = groq`
  *[_type=='printify.product' && featured && store.isVisible && !store.isDeleted][]{
    _id,
    _createdAt,
    defaultImageUrl,
    'slug':slug.current,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    colours[]->{
      _id,
      'label':title,
      'slug':slug.current,
      'colour':"#" + colour,
      'value':slug.current
    },
    store{
      title,
      productId,
      tags,
      description,
      variants,
      'pricedFrom':variants[]{
        price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      },

    }
  } | order(_createdAt desc)
`;
export const qryProductColours = groq`
  *[_type=='productColour'][]{
    _id,
    title,
    'slug':slug.current,
    'colour':"#" + colour
  }
`;

export const qryAllProductsByColour = groq`
  *[_type=='productColour'][]{
    _id,
    title,
    'slug':slug.current,
    'colour':"#" + colour,
    'products':*[_type == 'printify.product' && references(^._id) && store.isVisible && !store.isDeleted]{
      _id,
      defaultImage,
      defaultImageUrl,
      featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
      'slug':slug.current,
      store{
        title,
        productId,
        tags,
        description,
        variants,
        'pricedFrom':variants[]{
          price
        }|order(price asc)[0]
      }
    },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc)
  `;

export const qryProductsByColour = groq`
  *[_type=='productColour' && slug.current == $slug][0]{
    _id,
    title,
    'slug':slug.current,
    'colour':"#" + colour,
    'products':*[_type == 'printify.product' && references(^._id) && store.isVisible && !store.isDeleted]{
      _id,
      defaultImage,
      defaultImageUrl,
      featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
      'slug':slug.current,
      store{
        title,
        productId,
        tags,
        description,
        variants,
        'pricedFrom':variants[]{
          price
        }|order(price asc)[0]
      }
    },
    'promotedBy': *[_type=='promotion' && isActive
      && scope == 'products' && references(^._id)

      || scope == 'collections'
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
      },
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
      },
      cta,
      discount,
      promoStart,
      promoEnd,
      byline,
      summary,
      'slug': slug.current,
      title,
      scope,
      collections[]->{
        title,
        'slug':slug.current
      }
    }
  } | order(_createdAt desc)
`;

export const qryProductTags = groq`
*[_type=='printify.product'][]{
  "tags":store.tags
}
`;
