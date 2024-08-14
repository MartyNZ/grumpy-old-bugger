export const qryAuthors = groq`
  *[_type == "contact" && contactType match 'author'][]{
    _id,
    'slug':slug.current,
    'name':firstName + ' ' + lastName,
    'imageUrl':image.asset->url,
    'articles':*[_type == "article"&& references(^._id)]{
      _id,
      title,
      'slug':slug.current,
    }
  } | order(lastName asc)
`;

export const qryAuthorBySlug = groq`
  *[_type == "contact" && draft != true && slug.current == $slug ][0]{
    _id,
    'name':firstName + ' ' + lastName,
    'slug':slug.current,
    'imageUrl':image.asset->url,
    bio,
    socialConnections[]{
      'url': url + username,
      title,
      iconName,
    },
      'articles':*[_type == "article"&& references(^._id)]{
      _id,
      title,
      'slug':slug.current,
    }
  }
`;
