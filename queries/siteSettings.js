export const qrySiteSettings = groq`
*[_type == 'settings'][0]{
  siteOwner,
  title,
  'logoUrl':logo.asset->url,
  'image':image.asset->url,
  description,
  'email':primaryLocation->email,
  'address':primaryLocation->address,
  'addressExt':primaryLocation->addressExt,
  'city':primaryLocation->city,
  'postcode':primaryLocation->postcode,
  'country':primaryLocation->country,
  primaryLocation->{
    'lat':mapLocation.lat,
    'lng':mapLocation.lng,
    phoneNumbers[]{
      number,
      label,
    },
    socialConnections[]{
      _key,
      _type,
      title,
      'userUrl':url+username
    }
  }
  }
`;

export const qrySiteNavigation = groq`
  {
    "mainNav":*[_type=="navigation" && _id == "mainNavigation"][0]{
    _id,
    name,
    links[]->{
      _id,
      "root":true,
      _type,
      title,
      'slug':slug.current,
      printifyCollectionNavGroup[]->{
         _id,
        title,
        'slug':slug.current,
        parentCollection->{
          _id,
          title,
          'slug':slug.current,
          image,
          'imageUrl':image.asset->url,
          rules
        },
        childCollections[]->{
          _id,
          title,
          'slug':slug.current,
          image,
          'imageUrl':image.asset->url,
          rules
        },
      }
    }
  },
    "footerNav":*[_type=="navigation" && _id == "footerNavigation"][0]{
      _id,
      root,
      links[]->{
        _id,
        title,
        'slug':slug.current
      }
    }
  }
`;

export const qryPage = groq`
  *[_type == 'page' && slug.current==$slug && isActive][0]{
    title,
    isActive,
    'slug':slug.current,
    'image':image.asset->url,
    body,
    _id,
    sections[]->{
      ...
    }
  }
`;

export const qryContactPage = groq`
  *[_type == 'contactpage'][0]{
    title,
    'slug':slug.current,
    'image':image.asset->url,
    descr,
    _id,
    sections[]->{...}
  }
`;
