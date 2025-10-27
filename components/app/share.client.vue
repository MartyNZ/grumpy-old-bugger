<script setup lang="ts">

const canShare = computed(() => {
  return navigator.share !== undefined
})

const shareContent = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Grumpy Old Bugger',
        url: window.location.href
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }
}
</script>

<template>
  <button @click="shareContent" v-if="canShare" class="p-[0.5em]">
    <Icon name="solar:share-line-duotone" size="2em" />
  </button>
</template>
