<script setup>
const props = defineProps({
  id: {
    type: String
  }
})
import { qryWhyUsById } from '~/queries/sections'
const { data: whyUs } = await useSanityQuery(qryWhyUsById, {
  id: props.id
})
// console.log("Why Us: ", JSON.stringify(whyUs.value, null, 2))
</script>
<template>
  <section id="why-us" class="why-us">
    <div class="container" data-aos="fade-up">

      <div class="section-header">
        <h2>{{ whyUs.title }}</h2>

      </div>

      <div class="row g-0" data-aos="fade-up" data-aos-delay="200">

        <div class="col-xl-5 img-bg" :style="{ backgroundImage: `url(${whyUs.image.url})` }"></div>
        <div class="col-xl-7 position-relative">

          <Swiper :pagination="{ clickable: true, dynamicBullets: true }" :modules="[SwiperPagination, SwiperAutoplay]"
            :autoplay="{ delay: 8000, disableOnInteraction: false }">

            <SwiperSlide v-for="r in whyUs.reasons" :key="r._key">
              <div class="item">
                <h3 class="mb-3">{{ r.title }}</h3>
                <h4 class="mb-3">{{ r.subTitle }}</h4>
                <p>{{ r.summary }}</p>
              </div>
            </SwiperSlide>

          </Swiper>
        </div>

      </div>

    </div>
  </section>
</template>
<style lang="css">
.why-us {
  padding-bottom: 0;
}

.why-us .img-bg {
  min-height: 500px;
  background-size: cover;
}

.why-us .slides {
  background-color: #f7f9fc;
}

.why-us h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-secondary);
}

.why-us h4 {
  font-size: 18px;
  font-weight: 400;
  color: #29486a;
  font-family: var(--font-secondary);
}

.why-us .swiper {
  margin: 140px 140px 120px 140px;
  overflow: hidden;
}

.why-us .swiper-button-prev:after,
.why-us .swiper-button-next:after {
  font-size: 24px;
  color: var(--color-secondary);
}

.why-us .swiper-button-prev {
  left: 80px;
}

.why-us .swiper-button-next {
  right: 80px;
}

.why-us .swiper-pagination {
  margin-top: 30px;
  position: relative;
}

.why-us .swiper-pagination .swiper-pagination-bullet {
  background-color: var(--color-secondary);
}

.why-us .swiper-pagination .swiper-pagination-bullet-active {
  background-color: var(--color-primary);
}

@media (max-width: 1200px) {
  .why-us .swiper {
    margin: 60px 60px 40px 60px;
  }

  .why-us .swiper-button-prev,
  .why-us .swiper-button-next {
    display: none;
  }
}

@media (max-width: 575px) {
  .why-us .swiper {
    margin: 40px 40px 20px 40px;
  }
}

.page-about .why-us {
  padding: 0 0 80px 0;
}
</style>
