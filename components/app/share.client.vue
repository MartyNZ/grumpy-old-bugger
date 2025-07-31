<script setup lang="ts">

const canShare = computed(() => {
  return navigator.share !== undefined
})

const shareContent = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Digital Art Kiwi',
        url: window.location.href
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }
}
</script>

<template>
  <button @click="shareContent" v-if="canShare">
    <Icon name="solar:share-line-duotone" size="24"/>
  </button>
</template>
