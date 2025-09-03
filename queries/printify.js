export const qryAllPrintifyCollections = groq`
  *[_type=='printify.collection'][]{
  _id,
  title,
  description,
  'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
  'imageUrl':image.asset->url,
  'imageId':image.asset->_id,
  image{
    caption,
    altText,
    hotspot,
    asset->{
      _id,
      url,
      metadata
    },
  },
  'slug':slug.current,
  rules
}
`;

export const qryPrintifyCollectionBySlug = groq`
  *[_type=='printify.collection' && slug.current == $slug][0]{
    _id,
    title,
    description,
    'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
    'slug':slug.current,
    rules,
    image{
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
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
        'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
        'slug':slug.current,
        image{
          caption,
          altText,
          hotspot,
          asset->{
            _id,
            url,
            metadata
          },
        },
      },
      childCollections[]->{
        _id,
        title,
        description,
        'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
        'slug':slug.current,
        image{
          caption,
          altText,
          hotspot,
          asset->{
            _id,
            url,
            metadata
          },
        },
        'productCount': count(*[_type == "printify.product" && store.isVisible && !store.isDeleted && store.tags match ^.title && store.tags match ^.^.title])
      },
      'productCount': count(*[_type == "printify.product" && store.isVisible && !store.isDeleted && store.tags match ^.title])
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
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    'theme': design->theme->{
      _id,
      title,
      'slug': slug.current,
      image{
        'assetId': asset->_id,
        'url':asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata,
        },
      },
    },
    'slug':slug.current,
    design,
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
      options,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    design,
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
      options,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
  } | order(_createdAt desc) [0...6]
  `;
export const qryAllProductsByCollection = groq`
  *[_type == "printify.product" && store.$relation $condition "$selectedTag" && store.isVisible && !store.isDeleted]{
    _id,
    _createdAt,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    'slug':slug.current,
    'featureImageUrl':featureImage.asset->url,
      design,
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
      options,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    design,
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
      options,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    'slug':slug.current,
    details->{
      productFeatures[]{
        title,
        body
      },
      productSizes,
    },
    design->{
      _id,
      title,
      'slug':slug.current,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
        'url':asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
    },
    featureImage{
      'assetId': asset->_id,
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
      design,
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
      options,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
        'url':asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
    },
    featureImage{
      'assetId': asset->_id,
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
      design,
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
      options,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    'slug':slug.current,
    details,
    design,
    colours[],
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
    image{
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    'slug':slug.current,
    description,
    'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
    'designs':*[_type=='productDesign' && references(^._id) && count(*[_type=='printify.product' && references(^._id) && store.isVisible && !store.isDeleted]) > 0]{
      _id,
      title,
      'productCount': count(*[_type=='printify.product' && references(^._id) && store.isVisible && !store.isDeleted]),
      'slug':slug.current,
      image{
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
    }
  } | order(_createdAt desc)
`;
export const qryAllProductsByTheme = groq`
*[_type=='productTheme' && isActive][]{
  title,
  'slug':slug.current,
  'imageUrl':image.asset->url,
  description,
  'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
  'products':*[_type == 'printify.product' && references(^._id) && store.isVisible && !store.isDeleted]{
    _id,
    defaultImage,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
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
      options,
    }
  }
} | order(_createdAt desc)
`;

export const qryProductsByTheme = groq`
*[_type=='productDesign' && theme.slug.current == $slug][0]{
  _id,
  title,
  description,
  'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
  image{
    'assetId': asset->_id,
    'url': asset->url,
    caption,
    altText,
    hotspot,
    asset->{
      _id,
      url,
      metadata
    },
  },
  theme[]->{
    _id,
    title,
    'slug': slug.current,
  },
  'slug':slug.current,
  'products':*[_type == 'printify.product' && references(^._id) && store.isVisible && !store.isDeleted]{
    _id,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
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
      options,
      'pricedFrom':variants[]{
      price
      }|order(price asc)[0]
    }
  },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
    description,
    'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
    },
    image{
      'assetId': asset->_id,
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
    'slug':slug.current
  }
`;

export const qryProductsByDesign = groq`
*[_type=='productDesign' && slug.current == $slug][0]{
  _id,
  title,
  description,
  theme->{
    title,
    description,
    'excerpt': array::join(string::split(description, "")[0...125], "") + "...",
  },
    image{
      caption,
      altText,
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      }
    },
  'slug':slug.current,
  'products':*[_type == 'printify.product' && references(^._id) && store.isVisible && !store.isDeleted]{
    _id,
    defaultImageUrl,
    featureImage{
      'assetId':asset->_id,
      caption,
      altText,
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      }
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
      options,
      'pricedFrom':variants[]{
      price
      }|order(price asc)[0]
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        caption,
        altText,
        crop,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        }
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
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
      options,
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
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        }
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
      'slug':slug.current,
      store{
        title,
        productId,
        tags,
        description,
        variants,
        options,
        'pricedFrom':variants[]{
          price
        }|order(price asc)[0]
      }
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        }
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
      'url': asset->url,
      caption,
      altText,
      hotspot,
      asset->{
        _id,
        url,
        metadata
      },
    },
      'slug':slug.current,
      store{
        title,
        productId,
        tags,
        description,
        variants,
       options,
        'pricedFrom':variants[]{
          price
        }|order(price asc)[0]
      }
    },
    'promotedBy': *[_type=='promotion'
      && scope == 'products' && references(^._id)
      || scope == 'collections' && isActive
    ][]{
      image{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        }
      },
      socialImage{
        'assetId': asset->_id,
        'url': asset->url,
        caption,
        altText,
        hotspot,
        asset->{
          _id,
          url,
          metadata
        },
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
*[_type=='printify.product' && store.isVisible && !store.isDeleted][]{
  "tags":store.tags
}
`;
