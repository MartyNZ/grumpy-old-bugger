<script setup>
const props = defineProps({
  services: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <section id="services-list" class="services-list">
    <div class="container" data-aos="fade-up">

      <div class="section-header">
        <h2>{{ services.title }}</h2>

      </div>

      <div class="row gy-5">

        <div class="col-lg-4 col-md-6 service-item d-flex" v-for="item in services.services" :key="item._key"
          data-aos="fade-up" data-aos-delay="100">

          <div class="icon flex-shrink-0">
            <iconify-icon :icon="`${item.icon.provider}:${item.icon.name}`"
              style="font-size:2em;margin-right:0.3em;"></iconify-icon>
          </div>
          <div>
            <h4 class="title"><a href="#" class="stretched-link">{{ item.title }}</a></h4>
            <p class="description">{{ item.summary }}</p>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped></style>
