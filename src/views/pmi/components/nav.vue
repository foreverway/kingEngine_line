<template>
  <div
    class="nav-wrapper"
    :class="{
      'w190': !show, 'w30': show
    }"
  >
    <header>
      <span v-show="!show">导航{{ show }}</span>
      <i
        class="el-icon-arrow-left"
        @click="show = !show"
      />
    </header>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App'
})
export default class extends Vue {
  private pageName = '导航'
  private show: boolean = false
}
</script>
<style lang="scss" scoped>
.w190{
  width: 190px;
  transition: all linear 0.4s;
}
.w30{
  width: 30px;
  transition: all linear 0.4s;
}
.nav-wrapper{
  height: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
  header{
    display: flex;
    justify-content: space-between;
    color: #4a5460;
    font-size: 14px;
    font-weight: 600;
    i{
      font-weight: 600;
      cursor: pointer;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      border-radius: 2px;
      &:hover{
        background-color: rgb(238, 238, 238);
      }
    }
  }
}
</style>
