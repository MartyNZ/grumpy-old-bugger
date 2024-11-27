<script setup>
import { qryTestimonials } from '~/queries/sections'
const { data: testimonials } = await useSanityQuery(qryTestimonials)
// console.log("Testimonials: ", JSON.stringify(testimonials.value, null, 2))
</script>
<template>
  <section id="testimonials" class="testimonials">
    <div class="container" data-aos="fade-up">
      <!-- <pre>{{ testimonials }}</pre> -->

      <div class="section-header">
        <h2>{{ testimonials.title }}</h2>
        <p>{{ testimonials.summary }}</p>
      </div>
      <!-- <pre>{{ testimonials.testimonial }}</pre> -->
      <div class="slides-3 swiper" data-aos="fade-up" data-aos-delay="100">
        <Swiper :modules="[SwiperPagination, SwiperAutoplay]" :pagination="{ clickable: true, dynamicBullets: true }"
          :slides-per-view="1" :space-between="30" :breakpoints="{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }" :autoplay="{
            delay: 7000,
            disableOnInteraction: false,
          }" :loop="true">

          <template v-for="t in testimonials.testimonial">
            <SwiperSlide>
              <div class="testimonial-item">
                <!-- {{ t }} -->
                <div class="stars">
                  <template v-for="star in t.rating">
                    <iconify-icon icon="bi:star" class="mx-1"></iconify-icon>
                  </template>
                </div>
                <p>
                  {{ t.body }}
                </p>
                <div class="profile mt-auto">
                  <SanityImage :w="90" :h="90" :asset-id="t.contact.image.assetId" class="testimonial-img"
                    :alt="t.name" />
                  <h3 v-if="t.contact.name">{{ t.contact.name }}</h3>
                  <h4 v-if="t.organisation.name">{{ t.organisation.name }}</h4>
                </div>
              </div>
            </SwiperSlide>
          </template>

        </Swiper>
      </div>

    </div>
  </section>
</template>
