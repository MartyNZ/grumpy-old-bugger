<script setup>
import { qryAllPortfolioCategories, qryPortfolio } from '~/queries/porfolio'

const { data: categories } = await useSanityQuery(qryAllPortfolioCategories)
const { data: portfolio } = await useSanityQuery(qryPortfolio)

const { onLoaded: onGlightboxLoaded } = useScriptNpm(({
  packageName: 'glightbox',
  file: 'dist/js/glightbox.min.js',
  version: '3.0.6',
}))

const { onLoaded: onIsotopeLoaded } = useScriptNpm(({
  packageName: 'isotope-layout',
  file: 'dist/isotope.pkgd.min.js'
}))

let iso;
onGlightboxLoaded(() => {
  const portfolioLightbox = GLightbox({
    selector: ".preview-link",
  });
})

onIsotopeLoaded(() => {
  var grid = document.querySelector('.portfolio-container');
  iso = new Isotope(grid, {
    itemSelector: '.portfolio-item',
  });
  iso.arrange();
})

onMounted(() => {
  // Add event listener to filter links
  document.querySelectorAll('.portfolio-filters li').forEach((filterLink) => {
    filterLink.addEventListener('click', (event) => {
      const filterValue = event.target.getAttribute('data-filter');
      iso.arrange({ filter: filterValue });
    });
  })
})
</script>
<template>
  <section id="portfolio" class="portfolio">
    <div class="container" data-aos="fade-up">

      <div class="portfolio-isotope">
        <ul class="portfolio-filters" data-aos="fade-up" data-aos-delay="100">
          <li data-filter="*" class="filter-active">All</li>
          <template v-for="cat in categories" :key="cat._id">
            <li :data-filter="`.filter-${cat.slug}`">{{ cat.title }}</li>
          </template>
        </ul>

        <div class="row gy-4 portfolio-container" data-aos="fade-up" data-aos-delay="300">
          <template v-for="item in portfolio.items" :key="item._id">
            <div class="col-lg-4 col-md-6 portfolio-item" :class="`filter-${item.category.slug}`">
              <SanityImage :w="520" :asset-id="item.images[0].assetId" class="img-fluid" :alt="item.title" />
              <div class="portfolio-info">
                <h4>{{ item.title }}</h4>
                <p>{{ item.summary }}</p>
                <a :href="item.images[0].url" :title="item.title" data-gallery="portfolio-gallery-app"
                  class="preview-link">
                  <iconify-icon icon="bi:zoom-in"></iconify-icon>
                </a>
                <a :href="`/portfolio/${item.slug}`" title="More Details" class="details-link">
                  <iconify-icon icon="bi:link-45deg"></iconify-icon>
                </a>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>
  </section>
</template>
