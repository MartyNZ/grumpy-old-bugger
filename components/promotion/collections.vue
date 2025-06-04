<script setup>
const props = defineProps({
  promo: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
  }
})

const isDev = process.env.NODE_ENV === 'development';

// Build query reactively based on promo data
const query = computed(() => {
  if (!props.promo?.collections?.length) return null;

  const collection = props.promo.collections[0];
  if (!collection?.rules?.length) return null;

  const rules = collection.rules;
  const disjunctive = collection.disjunctive || false;

  const conditions = rules
    .filter((rule) => {
      const value = rule.relation === 'tags' ? rule.selectedTag : rule.selectedValue;
      return value && value.trim() !== '';
    })
    .map((rule) => {
      const value = rule.relation === 'tags' ? rule.selectedTag : rule.selectedValue;
      if (!value) return null;

      switch (rule.relation) {
        case 'tags':
          if (rule.condition === 'match') return `store.tags match "*${value}*"`;
          if (rule.condition === '==') return `store.tags == "${value}"`;
          if (rule.condition === 'startsWith') return `store.tags match "${value}*"`;
          break;
        case 'featured':
          return `featured == ${value === 'true'}`;
        case 'title':
          if (rule.condition === 'match') return `store.title match "*${value}*"`;
          if (rule.condition === '==') return `store.title == "${value}"`;
          if (rule.condition === 'startsWith') return `store.title match "${value}*"`;
          break;
      }
      return null;
    })
    .filter(Boolean);

  if (conditions.length === 0) return null;

  const operator = disjunctive ? ' || ' : ' && ';
  const whereClause = conditions.join(operator);

  return `*[_type == "printify.product" && store.isVisible && !store.isDeleted && ${whereClause}] {
    _id,
    _createdAt,
    _updatedAt,
    defaultImageUrl,
    featureImage{
      'assetId': asset->_id,
      'url':asset->url
    },
    'theme': design->theme->{
      _id,
      title,
      'slug': slug.current,
      image{
        'assetId': asset->_id,
        'url':asset->url
      },
    },
    'slug':slug.current,
    design,
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
      useSocialImage,
      socialImage{
        'assetId': asset->_id,
        'url': asset->url
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
        'slug':slug.current,
        rules,
        disjunctive
      }
    }
  } | order(_createdAt desc)
`;
});

// Only query when we have a valid query
const { data: products, pending, error } = query.value
  ? await useSanityQuery(query.value)
  : { data: ref([]), pending: ref(false), error: ref(null) };
</script>

<template>
  <div class="max-w-[1200px] mx-auto">
    <div v-if="isDev" class="bg-gray-100 dark:bg-gray-800 dark:text-surface-300 p-4 mb-4 text-xs">
      <h3 class="font-bold">Debug Info:</h3>
      <p><strong>Products count:</strong> {{ products?.length || 0 }}</p>

      <div v-if="products?.length" class="mt-4">
        <h4 class="font-bold">First Product Debug:</h4>
        <p><strong>Product Title:</strong> {{ products[0].store?.title }}</p>
        <p><strong>Product Tags:</strong> {{ products[0].store?.tags }}</p>
        <p><strong>Product Tags (split):</strong> {{products[0].store?.tags?.split(',').map(t => t.trim())}}</p>

        <div class="mt-2">
          <p><strong>Promotion Collections:</strong></p>
          <pre
            class="bg-white p-2 text-xs">{{ JSON.stringify(products[0].promotedBy?.[0]?.collections, null, 2) }}</pre>
        </div>

        <div class="mt-2">
          <p><strong>Tag Matching Test:</strong></p>
          <div v-for="tag in (products[0].store?.tags?.split(',') || [])" :key="tag">
            Tag: "{{ tag.trim() }}" matches collection "{{ products[0].promotedBy?.[0]?.collections?.[0]?.title }}":
            {{ tag.trim().toLowerCase() === products[0].promotedBy?.[0]?.collections?.[0]?.title?.toLowerCase() }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!query" class="text-center py-8 text-gray-500">
      No valid promotion rules found.
    </div>
    <div v-else-if="pending" class="text-center py-8">
      Loading products...
    </div>
    <div v-else-if="error" class="text-center py-8 text-red-500">
      Error: {{ error }}
    </div>
    <div v-else-if="!products?.length" class="text-center py-8">
      No products found for this promotion.
    </div>
    <div v-else>
      <product-list :products="products" :sectionTitle="promo.title" :description="promo.summary" :loading="loading" />
      <h2 class="text-2xl font-bold mb-6">{{ promo?.title }}</h2>
      <p v-if="promo?.summary" class="text-gray-600 mb-8">{{ promo.summary }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <product-summary-card v-for="product in products" :key="product._id" :product="product" :loading="false" />
      </div>
    </div>
  </div>
</template>
