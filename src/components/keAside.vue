<template>
  <aside
    :style="style"
    :class="[isDialog===true?'border':'']"
  >
    <header>
      <span v-if="isShow">{{ defaultTitle }}</span>
      <i
        class="el-icon-arrow-left"
        @click="toggle"
      />
    </header>
    <slot v-if="isShow" />
  </aside>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'KeAside'
})
export default class extends Vue {
  @Prop() private width!:any
  @Prop() private isDialog!:any
  @Prop() private title!:any
  private minWidth:string = '32px'
  private defaultWidth:string = '230px'
  private defaultTitle:string = '导航卡'
  private isShow:boolean=true
  private style:any={}
  created() {
    this.setTitle()
    this.setWidth()
  }
  private toggle(): void {
    this.isShow = !this.isShow
    this.setWidth()
  }
  private setTitle() {
    if (this.title !== undefined) {
      this.defaultTitle = this.title
    }
  }
  private setWidth() {
    if (this.isShow) {
      this.style.width = this.width || this.defaultWidth
    } else {
      this.style.width = this.minWidth
    }
    console.log(this.style.width)
  }
}
</script>
<style lang="scss" scoped>
  aside{
    transition-property:width;
    transition-duration:0.4s;
    &.border{
      border:1px solid #EBEEF5;
      border-radius: 4px;
    }
    header{
      height:22px;
      line-height: 22px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      justify-content:space-between;
      i{
        cursor: pointer;
      }
    }
  }
</style>
