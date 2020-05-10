<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'Guestbook'
})
export default class extends Vue {
}
</script>
<style lang="scss" scoped>
</style>
