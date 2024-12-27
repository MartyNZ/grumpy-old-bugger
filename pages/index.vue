<script setup>
import { qryFeaturedProducts, qryLatestProducts } from "~/queries/printify";
import { qryAllLivePromotions } from "~/queries/promotions";

const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation;

const { data: latestArticles } = await useSanityQuery(`
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
`);
const { data: latestProducts } = await useSanityQuery(qryLatestProducts);
const { data: products } = await useSanityQuery(qryFeaturedProducts);
const { data: promotions } = await useSanityQuery(qryAllLivePromotions);
const data = useSiteSettingsStore();
const settings = data.settings;
// console.log("From Index: ", JSON.stringify(settings, null, 2));

useSeoMeta({
  icon: () => settings.logoUrl,
  title: () => settings.title,
  ogTitle: () => settings.title,
  description: () => settings.description,
  ogDescription: () => settings.description,
  ogImage: () => settings.image,
  twitterTitle: () => settings.title,
  twitterDescription: () => settings.description,
  twitterImage: () => settings.image,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'default',
  {
    title: settings.title,
    description: settings.description,
    image: settings.image,
    siteName: settings.title,
    icon: settings.logoUrl,
  });

definePageMeta({
  layout: "false",
});

</script>

<template>
  <div>
    <NuxtLayout name="homepage">
      <promotion-carousel :promotions="promotions" />
      <main class="@container mx-auto mb-16 max-w-[1280px] px-4">
        <product-collection-buttons :collectionNav="collectionNav" />
        <product-list :products="products" sectionTitle="Featured Products" />
        <article-list :articles="latestArticles" />
        <product-list :products="latestProducts" sectionTitle="Latest Products" />
      </main>
    </NuxtLayout>
  </div>
</template>
