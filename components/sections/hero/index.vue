<script setup>
import { qryHero } from '~/queries/sections.js'
const { data: hero } = await useSanityQuery(qryHero)


const { onLoaded: onGlightboxLoaded } = useScriptNpm(({
  packageName: 'glightbox',
  file: 'dist/js/glightbox.min.js',
  version: '3.0.6',
}))

onGlightboxLoaded(() => {
  const heroLightbox = GLightbox({
    selector: ".btn-watch-video",
  });
})

</script>
<template>
  <section id="hero" class="hero d-flex align-items-center" :style="{ backgroundImage: `url(${hero.image.url})` }">
    <div class="container">
      <div class="row">
        <div class="col-xl-4">
          <h2 data-aos="fade-up">{{ hero.title }}</h2>
          <blockquote data-aos="fade-up" data-aos-delay="100">
            <SanityContent :blocks="hero.content" />
          </blockquote>
          <AppButtons :buttons="hero.buttons" />
        </div>
      </div>
    </div>
  </section>
</template>
