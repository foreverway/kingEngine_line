<template>
  <div>
    <footer>版权所有 © 2019 深圳金证引擎科技有限公司 版权所有</footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import variables from '@/styles/_variables.scss'

@Component({
  name: 'MainFooter',
  components: {
  }
})
export default class extends Vue {
  private routes: any = []
  created() {
  }
}
</script>

<style lang="scss" scoped>
footer{
  background: #fff;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  color: #5e6d82;
  border-top:1px solid #ddd;
}
</style>
