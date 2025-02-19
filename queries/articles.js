export const qryAllCategories = groq`
  *[_type == "article.category"][]{
      _id,
      name,
      'slug': slug.current,
  }
`;
export const qryAllCollections = groq`
  *[_type == "article.collection"][]{
      _id,
      title,
      'slug': slug.current,
  }
`;

export const qryArticlesSection = groq`
  *[_type == "articles.section"][0]{
    _id,
    title,
    image{
      'url':asset->url,
      'assetId':asset->_id
    },
    description,
    latestArticles->{
      displayNumber,
      title,
      summary
    }
  }
`;

export const qryAllArticles = groq`
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
    category->{
      title,
      'slug':slug.current,
    },
    authors[]->{
      _id,
      'slug':slug.current,
      'name':firstName + ' ' + lastName,
      image{'assetId':asset->_id,'url':asset->url},
    },
  } | order(publishedDate desc)
`;

export const qryArticles = groq`
  *[_type == "article" && draft != true && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
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
    category->{
      title,
      'slug':slug.current,
    },
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

export const qryArticleLatest = groq`
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
    'category':category->{
      title,
      'slug':slug.current
    }
  } | order(publishedDate desc)[0...3]
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
    category->{
      title,
      'slug':slug.current,
    },
  } | order(publishedDate desc)[0...$number]
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
    'excerpt': array::join(string::split(pt::text(body), "")[0...100], "") + "...",
    publishedDate,
    category->{
      title,
      'slug':slug.current,
    },
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
  }
`;

export const qryAllArticlesByCategory = groq`
*[_type == "article.category"][]{
    _id,
    title,
    image{
      'url':asset->url,
      'assetId':asset->_id
    },
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
      'excerpt': array::join(string::split(pt::text(body), "")[0...175], "") + "...",
      publishedDate,
    category->{
      title,
      'slug':slug.current,
    },
      authors[]->{
        _id,
        'slug':slug.current,
        'name':firstName + ' ' + lastName,
        'imageUrl':asset->url,
      } | order(publishedDate desc)
    }
  }
`;

export const qryArticlesByCategory = groq`
*[_type == "article.category" && slug.current == $slug][0]{
    _id,
    title,
    image{
      'url':asset->url,
      'assetId':asset->_id
    },
    'slug':slug.current,
    description,
    'excerpt': array::join(string::split(pt::text(description), "")[0...75], "") + "...",
    'articles':*[_type=='article' && draft!= true && references(^._id) && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
      _id,
      title,
      'slug': slug.current,
      image{
        'url': asset->url,
        "assetId":asset->_id
      },
      'excerpt': array::join(string::split(pt::text(body), "")[0...175], "") + "...",
      publishedDate,
    category->{
      title,
      'slug':slug.current,
    },
      authors[]->{
        _id,
        'slug':slug.current,
        'name':firstName + ' ' + lastName,
        'imageUrl':asset->url,
      } | order(publishedDate desc)
    }
  }
`;

export const qryAllArticleTags = groq`
 *[_type == 'article.tag'][]{
  _id,
  tag
}
`;

export const qryArticleCollectionNavigation = groq`
*[_type == "article.collectionNavigation" && _id == 'articleCollectionNavigation'][0]{
    _id,
    title,
    'slug':slug.current,
    articleCollectionNavGroup[]->{
        _id,
      title,
      'slug':slug.current,
      parentCollection->{
        _id,
        title,
        description,
        'excerpt': array::join(string::split(pt::text(description), "")[0...125], "") + "...",
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
        'excerpt': array::join(string::split(pt::text(description), "")[0...125], "") + "...",
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

export const qryArticleCountByCategory = groq`
*[_type == "article.category"][] {
  title,
  'slug':slug.current,
  'articleCount':count(*[_type == 'article' && references(^._id)])
}`;

export const qryArticleCountByCollection = groq`
*[_type == "article.collection"][] {
  title,
  'slug':slug.current,
  'articleCount':count(*[_type == 'article' && references(^._id)])
}`;
