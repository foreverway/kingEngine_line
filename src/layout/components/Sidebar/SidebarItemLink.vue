<template>
  <a
    v-if="isExternal(to)"
    :href="to"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <router-link
    v-else
    :to="to"
    @click.native="logo(to)"
  >
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'SidebarItemLink'
})
export default class extends Vue {
  @Prop({ required: true }) private to!: string
  @Prop({ type: Object, default: {} }) theOnlyOneChild !: object

  private logo(): void {
    console.log(this.theOnlyOneChild)
    // const dub = this.theOnlyOneChild.doubleScreen === 1 ? true : false
    AppModule.SET_DOUBLE(false)
  }
  private isExternal = isExternal
}
</script>
