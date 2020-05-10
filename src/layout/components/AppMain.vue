<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view />
      </keep-alive><router-view
        v-if="!$route.meta.keepAlive"
      />
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TabModule } from '@/store/modules/tab'
  @Component({
    name: 'AppMain'
  })
export default class extends Vue {

}
</script>

<style lang="scss">

  .app-main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    > div,
    .app-main-section{
      height: 100%;
      > div{
        height:100%;
      }
    }
  }
</style>
