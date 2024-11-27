export const qryAllPortfolioCategories = groq`
  *[_type == "portfolio.category" && isActive][]{
    _id,
    title,
    'slug':slug.current
  }
`;
export const qryPortfolio = groq`
  *[_type == "portfolio"][0]{
    title,
    summary,
    items[]->{
      _id,
      'slug':slug.current,
      'url':url.url,
      summary,
      client->{
        'name': firstName + " " + lastName,
      },
      category->{
        title,
        'slug':slug.current,
      },
      completionDate,
      images[]{
        'url':asset->url,
        'assetId':asset->_id
      }
    }
  }
`;

export const qryPortfolioItem = groq`
*[_type == "portfolio.item" && draft != true && slug.current == $slug ][0]{
    _id,
    title,
    'slug':slug.current,
    'url':url.url,
    summary,
    client->{
      'name': firstName + " " + lastName,
    },
    category->{
      title,
      'slug':slug.current,
    },
    completionDate,
    images[]{
      'url':asset->url,
      'assetId':asset->_id
    }
  }
`;
