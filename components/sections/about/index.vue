<script setup>
import { qryAbout } from '~/queries/sections';
const { data: about } = await useSanityQuery(qryAbout)
</script>

<template>
  <section id="about" class="about">
    <div class="container" data-aos="fade-up">

      <div class="row gy-4" data-aos="fade-up">
        <div class="col-lg-4">
          <SanityImage :asset-id="about.image.assetId" class="img-fluid" :alt="about.title" />
        </div>
        <div class="col-lg-8">
          <div class="content ps-lg-5">
            <h3>{{ about.title }}</h3>
            <SanityContent :blocks="about.body" />
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
