<template>
  <h3 class="q-my-md">
    <q-icon :name="icon" class="vertical-top" />
    {{ title }}
    <slot></slot>
  </h3>
</template>

<script>
export default {
  name: 'TitlePage',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>
