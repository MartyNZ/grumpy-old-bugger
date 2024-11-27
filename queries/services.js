export const qryServices = groq`
  *[_type == 'services'][]{
    title,
    services[]->{
      _id,
      title,
      summary,
      image{
        'url':asset->url,
        'assetId': asset->assetId
      },
      icon{
        style,
        provider,
        name,
      }
    },
  }
`;

export const qryServicesById = groq`
  *[_type == 'services' && _id == $id][0]{
    _id,
    layout,
    title,
    services[]->{
      _key,
      title,
      summary,
      image{
        'url':asset->url,
        'assetId': asset->assetId
      },
      icon{
        provider,
        name,
        'colour':iconColour.hex
      }
    },
  }
`;
