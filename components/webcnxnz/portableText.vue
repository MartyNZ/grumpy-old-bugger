<script setup>
import { PortableText } from "@portabletext/vue";
const props = defineProps({
  blocks: {
    type: Array,
    required: true,
  },
});
const components = {
  types: {
    image: ({ value }) => h("img", { src: value.imageUrl }),
  },
};
</script>

<template>
  <div class="portable-text">
    <PortableText :value="blocks" :components="components" />
  </div>
</template>
<style>
.portable-text {
  margin-inline: 1.5rem;
  h1 {
    font-size: xx-large;
  }
  h2 {
    font-size: large;
    font-weight: 700;
    font-style: italic;
  }
  h3 {
    font-size: large;
    font-weight: 600;
  }
  h4 {
    font-size: larger;
  }
  h5 {
    font-size: medium;
  }
  h6 {
    font-size: small;
    font-weight: 600;
  }
  ul {
    list-style-type: disc;
    margin: 1rem;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }

    li.has-child::marker {
      content: "";
      ul {
        list-style-type: circle;
        margin: 0.25rem;
        padding-left: 1rem;

        li {
          margin-bottom: 0.5rem;
        }
      }
    }
  }
  ol {
    list-style-type: decimal;
    margin: 1rem;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
  blockquote {
    border-left: 4px solid rgb(var(--primary-400));
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    background: rgb(var(--surface-100));
    font-style: italic;
  }
  .dark blockquote {
    background: rgb(var(--surface-800));
  }
  p {
    margin-bottom: 1rem;
    text-align: justify;
  }
}
</style>
