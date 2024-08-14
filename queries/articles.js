export const qryAllCategories = groq`
  *[_type == "article.category"][]{
      _id,
      name,
      'slug': slug.current,
  }
`;
export const qryArticlesLatest = groq`
  *[_type == "article" && draft != true && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
    _id,
    title,
    'slug': slug.current,
    image{
    'url': asset->url,
    "assetId":asset->_id
    },
    'excerpt': array::join(string::split(pt::text(body), "")[0...175], "") + "...",
    publishedDate,
    'category':category->{name,'slug':slug.current}
  } | order(publishedDate desc)[0...12]
`;
export const qryArticlesLatest3 = groq`
  *[_type == "article" && draft != true && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
    _id,
    title,
    'slug': slug.current,
    image{
    'url': asset->url,
    "assetId":asset->_id
    },
    'excerpt': array::join(string::split(pt::text(body), "")[0...255], "") + "...",
    publishedDate,
    'category':category->{name,'slug':slug.current},
  } | order(publishedDate desc) [0...3]
`;

export const qryArticleBySlug = groq`
  *[_type == "article" && draft != true && slug.current == $slug ][0]{
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
      nomDePlume,
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
  }
`;

export const qryAllArticlesByCategory = groq`
  *[_type == "article.category" ][]{
    _id,
    name,
    'slug':slug.current,
    description,
    'articles':*[_type=='article' && draft!= true && references(^._id) && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
      _id,
      title,
      'slug': slug.current,
    image{
    'url': asset->url,
    "assetId":asset->_id
    },
      'excerpt': array::join(string::split(pt::text(body), "")[0...255], "") + "...",
      publishedDate,
      'category':category->{name,'slug':slug.current}
    } | order(publishedDate desc)
  }
`;

export const qryArticlesByCategory = groq`
  *[_type == "article.category" && slug.current == $slug][0]{
    _id,
    name,
    'slug':slug.current,
    description,
    'articles':*[_type=='article' && draft!= true && references(^._id) && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
      _id,
      title,
      'slug': slug.current,
    image{
    'url': asset->url,
    "assetId":asset->_id
    },
      'excerpt': array::join(string::split(pt::text(body), "")[0...255], "") + "...",
      publishedDate,
      'category':category->{name,'slug':slug.current}
    } | order(publishedDate desc)
  }
`;

export const qryAllArticleTags = groq`
 *[_type == 'tag'][]{
  _id,
  tag
}
`;

export const qryArticleCollectionNavigation = groq`
  *[_type == "article.collectionNavigation" && _id == "articleCollectionNavigation"][0]{
    _id,
    title,
    'slug':slug.current,
    articleCollectionNavGroup[]->{
      parentCollection->{
        _id,
        name,
        'slug':slug.current,
      },
      childCollections[]->{
        _id,
        name,
        'slug':slug.current,
      }
    }
  }
`;
