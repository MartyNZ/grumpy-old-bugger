export const qryAuthors = groq`
  *[_type == "contact" && _id in *[_type == "article"].authors[]._ref][]{
    _id,
    'slug':slug.current,
    'name':firstName + ' ' + lastName,
    firstName,
    lastName,
    'imageUrl':image.asset->url,
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
    'articles':*[_type == "article"&& references(^._id)]{
      _id,
      title,
      'slug':slug.current,
    }
  } | order(lastName asc)
`;

export const qryAuthor = groq`
  *[_type == "contact" && slug.current == $slug][0]{
    _id,
    'slug':slug.current,
    'name':firstName + ' ' + lastName,
    firstName,
    lastName,
    bio,
    'excerpt': array::join(string::split((pt::text(bio)), "")[0...125], "") + "...",
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
    'latestArticles':*[_type == "article"&& references(^._id) && draft != true && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
      _id,
      title,
      'slug':slug.current,
      publishedDate,
      'excerpt': array::join(string::split((pt::text(body)), "")[0...125], "") + "...",
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
    } | order(publishedDate desc)[0...3]
  }
`;
