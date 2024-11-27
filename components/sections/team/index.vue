<script setup>
import { qryTeam } from '~/queries/sections'
const { data: team } = await useSanityQuery(qryTeam)
// console.log("Team: ", JSON.stringify(team.value, null, 2))
</script>
<template>
  <section id="team" class="team">
    <div class="container" data-aos="fade-up">
      <div class="section-header">
        <h2>{{ team.title }}</h2>
        <p>{{ team.summary }}</p>
      </div>

      <div class="row gy-4">
        <template v-for="member in team.members" :key="member._id">
          <!-- <pre>{{ member }}</pre> -->
          <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="team-member">
              <div class="member-img">
                <SanityImage :asset-id="member.image.assetId" :max-w="510" class="img-fluid" :alt="member.name" />

                <div class="social" v-if="member.details">
                  <template v-if="member.details.socialConnections">
                    <NuxtLink v-for="c in member.details.socialConnections" :key="c._key" :to="c.url" target="_blank">
                      <iconify-icon :icon="`fa-brands:${c._type}`" size="1.5em"></iconify-icon>
                    </NuxtLink>
                  </template>
                </div>

              </div>
              <div class="member-info">
                <h4 v-if="member.name">{{ member.name }}</h4>
                <span v-if="member.teamDetails">{{ member.teamDetails.role }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
