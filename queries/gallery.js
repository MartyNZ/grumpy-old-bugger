export const qryAllCategories = groq`
  *[_type == "image.category"][]{
      _id,
      name,
      'slug': slug.current,
  }
`;

export const qryGallery = groq`
  *[_type == "gallery"][0]{
    _id,
    title,
    image{
      'url':asset->url,
      'assetId':asset->_id
    },
    description,
    latestImages->{
      title,
      summary,
      displayNumber
    }
  }
`;

export const qryAllImages = groq`
*[_type == "gallery.image" && draft != true][]{
  _id,
  title,
  'slug': slug.current,
  featureImage,
  image{
    'url': asset->url,
    "assetId":asset->_id,
    caption,
    altText,
    hotspot,
    asset->
  },
  collections[]->,
}
`;

export const qryImages = groq`
  *[_type == "gallery.image"]{
    _id,
    title,
    'slug': slug.current,
    image{
    'url': asset->url,
    "assetId":asset->_id
    },
    body,
    'excerpt': array::join(string::split(pt::text(body), "")[0...175], "") + "...",
    publishedDate,
    'category':category->{name,'slug':slug.current},
    authors[]->{
      _id,
      'slug':slug.current,
      'name':firstName + ' ' + lastName,
      'imageUrl':asset->url,
    },
    relatedProducts[]->{
      _id,
      'title': store.title,
      _createdAt,
      defaultImageUrl,
      'slug':slug.current,
      featureImage{
        'assetId': asset->_id,
        'url':asset->url
      },
      store{
        title
      }
    }
  } | order(publishedDate desc)[]
`;

export const qryImagesLatest = groq`
  *[_type == "gallery.image"]{
    _id,
    title,
    'slug': slug.current,
    image{
    'url': asset->url,
    "assetId":asset->_id
    },
    'excerpt': array::join(string::split(pt::text(body), "")[0...175], "") + "...",
    publishedDate,
    'category':category->{
      title,
      'slug':slug.current
    }
  } | order(publishedDate desc)[0...$number]
`;

export const qryImageBySlug = groq`
*[_type == "gallery.image" && draft != true && slug.current == $slug ][0]{
  _id,
  title,
  'slug': slug.current,
  featureImage,
  image{
    caption,
    altText,
    hotspot,
    'assetId':asset->_id,
    'url':asset->url,
    asset->
  },
  collections[]->,
}
`;

export const qryAllImagesByCollection = groq`
*[_type == "gallery.collection"][]{
  _id,
  title,
  'slug':slug.current,
  description,
  'images':*[_type=='gallery.image' && draft!= true && references(^._id)]{
    _id,
    title,
    'slug': slug.current,
    featureImage,
    image{
      caption,
      altText,
      hotspot,
      'assetId':asset->_id,
      'url':asset->url,
      asset->
    },
    collections[]->,
  }
}
`;

export const qryImagesByCollection = groq`
*[_type == "gallery.collection" && slug.current == $slug][0]{
  _id,
  title,
  'slug':slug.current,
  description,
  'images':*[_type=='gallery.image' && draft!= true && references(^._id)]{
    _id,
    title,
    'slug': slug.current,
    featureImage,
    image{
      caption,
      altText,
      hotspot,
      'assetId':asset->_id,
      'url':asset->url,
      asset->
    },
    collections[]->,
  }
}
`;

export const qryAllImageTags = groq`
 *[_type == 'image.tag'][]{
  _id,
  tag
}
`;

export const qryImageCollectionNavigation = groq`
*[_type == "image.collectionNavigation" && _id == 'gallery.imageCollectionNavigation'][0]{
    _id,
    title,
    'slug':slug.current,
    gallery.imageCollectionNavGroup[]->{
      _id,
      title,
      'slug':slug.current,
      category->{
        _id,
        title,
        'slug':slug.current,
        image{
          'url':asset->url,
          'assetId':asset->_id
        },
        description,
        'count':count(*[_type == 'gallery.image' && references(^._id)])
      },
      collections[]->{
        _id,
        title,
        'slug':slug.current,
        image{
          'url':asset->url,
          'assetId':asset->_id
        },
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
  }
`;

export const qryImageCount = groq`
*[_type == "gallery.collection"][] {
  title,
  'slug':slug.current,
  'images':count(*[_type == 'gallery.image' && references(^._id)])
}`;
