<script setup>
const props = defineProps({
  features: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div>
    <div class="container" data-aos="fade-up">
      <div class="row">
        <div class="col-lg-7" data-aos="fade-up" data-aos-delay="100">
          <h3 style="text-wrap:balance">{{ features.title }}</h3>

          <div class="row gy-4">

            <div v-for="i in features.featureList" :key="i._id" class="col-md-6">
              <div class="icon-list d-flex align-items-center">
                <iconify-icon :icon="`${i.icon.provider}:${i.icon.name}`"
                  :style="{ color: i.icon.colour }"></iconify-icon>
                <span>{{ i.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5 position-relative" data-aos="fade-up" data-aos-delay="200">
          <div class="phone-wrap">
            <SanityImage :asset-id="features.image.assetId" :alt="features.title" class="img-fluid" />
          </div>
        </div>
      </div>

    </div>

    <div class="details">
      <div class="container" data-aos="fade-up" data-aos-delay="300">
        <div class="row">
          <div class="col-md-6">
            <h4 style="text-wrap:balance">{{ features.subTitle }}</h4>
            <p>{{ features.body }}</p>

            <NuxtLink v-if="features.cta.linkType === 'Internal'" :to="features.cta.internalLink.link.slug"
              class="btn-get-started mx-2">
              {{
                features.cta.title }}</NuxtLink>
            <NuxtLink v-else-if="features.cta.linkType === 'Phone'" :to="`tel:${features.cta.phone.number}`"
              class="btn-get-started mx-2">
              {{
                features.cta.title }}</NuxtLink>
            <NuxtLink v-else-if="features.cta.linkType === 'External'" :to="features.cta.externalLink.url"
              class="btn-get-started mx-2" target="_blank">
              {{ features.cta.title }}</NuxtLink>
            <a v-else :href="cta.externalVideo.url" class="glightbox btn-watch-video d-flex align-items-center mx-2">
              <iconify-icon icon="bi:play-circle"></iconify-icon><span class="ms-1">{{ features.cta.title }}</span>
            </a>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped></style>
