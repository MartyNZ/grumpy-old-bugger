export const qryAllLivePromotions = groq`
  *[_type == "promotion" && isActive && dateTime(promoStart) < dateTime(now()) && (dateTime(promoEnd) > dateTime(now()) || dateTime(promoEnd) == null)][]{
    _id,
    title,
    'slug':slug.current,
    byLine,
    summary,
    cta,
    scope,
    discount,
    promoStart,
    promoEnd,
    image{
      'assetId': asset->_id,
      'url': asset->url
    },
    useSocialImage,
    socialImage{
      'assetId': asset->_id,
      'url': asset->url
    },
    collections,
    products,
    siteWide,
    coupon
  } | order(promoStart asc)
`;

export const qryActiveCollectionPromotions = groq`
  *[_type == "promotion" && isActive && dateTime(promoStart) < dateTime(now()) && dateTime(promoEnd) > dateTime(now()) && scope == 'collections'][]{
    _id,
    title,
    'slug':slug.current,
    scope,
    discount,
    promoStart,
    promoEnd,
    collections[]->{
      'tag': rules.selectedTag,
    },
  } | order(promoStart asc)
`;
export const qryPromotionBySlug = groq`
  *[_type == "promotion" && isActive && dateTime(promoStart) < dateTime(now()) && (dateTime(promoEnd) > dateTime(now()) || dateTime(promoEnd) == null) && slug.current == $slug][0]{
    _id,
    title,
    'slug':slug.current,
    byline,
    summary,
    cta,
    scope,
    coupon,
    discount,
    promoStart,
    promoEnd,
    image{
      'assetId': asset->_id,
      'url': asset->url
    },
    useSocialImage,
    socialImage{
      'assetId': asset->_id,
      'url': asset->url
    },
    collections[]->,
    products[]->{
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
  },
}
`;

export const qryPromotedProducts = groq`
  *[_type == "promotion" && isActive && dateTime(promoStart) < dateTime(now()) && dateTime(promoEnd) > dateTime(now())][]{
    _id,
    title,
    'slug':slug.current,
    byLine,
    summary,
    cta,
    scope,
    discount,
    promoStart,
    promoEnd,
    image{
      'assetId': asset->_id,
      'url': asset->url
    },
    collections,
    products,
    siteWide,
    coupon
  }`;
