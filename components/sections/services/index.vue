<script setup>
import { qryServicesById } from '~/queries/services'
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  layout: {
    type: String
  }
})
const { data: services } = await useSanityQuery(qryServicesById, {
  id: props.id
})
// console.log("Services: ", JSON.stringify(services.value))
</script>

<template>
  <div>
    <SectionsServicesCards :services="services" v-if="layout == 'cards'" />

    <SectionsServicesList :services="services" v-else-if="layout === 'list'" />
  </div>
</template>
