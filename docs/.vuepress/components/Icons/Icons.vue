<template>
  <div>
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="icon"></use>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: '20px'
  },
  name: {
    type: String,
    default: ''
  }
})

const fontSize = computed(() => {
  return props.size.replace('px', '') + 'px';
})

const icon = computed(() => {
  return '#icon-' + props.name.replace('icon-', '')  ;
})
</script>

<style lang="scss" scoped>
.icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-size: v-bind(fontSize);
}
</style>