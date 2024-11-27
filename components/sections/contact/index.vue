<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
</script>
<template>
  <section id="contact" class="contact" style="background-image:url('/assets/img/contact-bg.png')">
    <div class="container position-relative" data-aos="fade-up">

      <div class="row gy-4 d-flex justify-content-end">
        <div class="col-lg-5" data-aos="fade-up" data-aos-delay="100">

          <div class="info-item d-flex align-items-center gap-2 text-primary">
            <iconify-icon icon="bi:geo-alt" size="2rem"></iconify-icon>
            <div>
              <h4>Location:</h4>
              <p class="text-dark">{{ settings.address }}, <span v-if="settings.addressExt">{{ settings.addressExt
                  }}</span>, {{ settings.city }}, {{ settings.state }} {{ settings.postcode }}</p>
            </div>
          </div><!-- End Info Item -->

          <div class="info-item d-flex align-items-center gap-2 text-primary">
            <iconify-icon icon="bi:envelope" size="2rem"></iconify-icon>
            <div>
              <h4>Email:</h4>
              <p class="text-dark">{{ settings.email }}</p>
            </div>
          </div><!-- End Info Item -->

          <div class="info-item d-flex align-items-center gap-2 text-primary">
            <iconify-icon icon="bi:phone" size="2rem"></iconify-icon>
            <div>
              <h4>Call:</h4>
              <p class="text-dark"><span v-for="phone in settings.primaryLocation.phoneNumbers" :key="phone._id">{{
                phone.number }}</span></p>
            </div>
          </div><!-- End Info Item -->

        </div>

        <div class="col-lg-6" data-aos="fade-up" data-aos-delay="250">

          <FormContact />

        </div>

      </div>

    </div>
  </section>
</template>
