<script setup>
const props = defineProps({
  services: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <section id="services-cards" class="services-cards">
    <div class="container" data-aos="fade-up">

      <div class="row gy-4">

        <template v-for="card in services.services" :key="card._key">
          <div class="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <div class="card-item">
              <div class="row">
                <div class="col-xl-5">
                  <div class="card-bg" :style="{ backgroundImage: `url(${card.image.url})` }"></div>
                </div>
                <div class="col-xl-7 d-flex align-items-center">
                  <div class="card-body">
                    <h4 class="card-title">{{ card.title }}</h4>
                    <p>{{ card.summary }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>

      </div>

    </div>
  </section>
</template>
