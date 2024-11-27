export const qryHero = groq`
  *[_type == 'hero'][0]{
    title,
    buttons[]{
      title,
      linkType,
      _key,
      internalLink{
        'link':reference->{
          'slug':slug.current
        }
      },
      externalLink{
        url
      },
      'phone':{
        'number':phoneNumber->number,
        'label':phoneNumber->label
      },
      externalVideo{
        url
      }
    },
    image{
      'url': asset->url,
      'assetId': asset->assetId
    },
    content
  }
`;

export const qryWhyUs = groq`
  *[_type == 'whyUs'][]{
    title,
    reasons[]{
      _key,
      title,
      subTitle,
      summary
    },
    image{
      'url':asset->url,
      'assetId': asset->assetId
    }
  }
`;

export const qryWhyUsById = groq`
  *[_type == 'whyUs' && _id == $id][0]{
    title,
    reasons[]{
      _key,
      title,
      subTitle,
      summary
    },
    image{
      'url':asset->url,
      'assetId': asset->assetId
    }
  }
`;

export const qryAbout = groq`
  *[_type == 'about'][0]{
    _id,
    title,
    image{
      'url':asset->url,
        'assetId':asset->_id
    },
    body
  }
`;

export const qryTeam = groq`
*[_type == 'team'][0]{
  title,
  summary,
  members[]->{_id,
  'name': firstName + " " + lastName,
  image{
    'url':asset->url,
      'assetId':asset->_id
  },
  details{
    socialConnections[]{
      _key,
      _type,
      title,
      'url':url + username,
    }
  },
  teamDetails{
    role,
    bio
  }
}
}
`;

export const qryContactTypeBySlug = groq`
*[_type == "contact" && references(*[_type == 'contact.type' && slug.current == $slug]._id)][0]{
    _id,
    'name': firstName + " " + lastName,
    image{
      'url':asset->url,
        'assetId':asset->_id
    },
  details{
    socialConnections[]{
      _key,
      _type,
      title,
      'url':url + username,
    }
  },
  teamDetails{
    role,
    bio
  }
}
`;

export const qryTestimonials = groq`
  *[_type == "testimonials" && _id == 'testimonials'][0]{
    _id,
    title,
    summary,
    testimonial[]{
      _key,
      body,
      rating,
      contact->{
        'name': firstName + ' ' + lastName,
        image{
          'url':asset->url,
          'assetId':asset->_id
        },
        'slug':slug.current
      },
      organisation->{
        name,
        logo{
          'url':asset->url,
          'assetId':asset->_id
        }
      }
    }
  }
`;

export const qryPolicyById = groq`
  *[_type == 'policy' && _id == $id][0]{
    _id,
    title,
    content
  }
`;
