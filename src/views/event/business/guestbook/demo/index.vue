<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-tabs
        v-model="activeName"
        class="ke-tab"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基本信息"
          name="first"
        >
          <add-form
            v-if="flag"
            :active-name.sync="activeName"
          />
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'ShiftsSetting',
  components: {
    AddForm: () => import('./add.vue')
  }
})
export default class extends Vue {
  private activeName:string = 'first'
  private flag: boolean = false
  private handleClick(tab: any, event: any): void {
    // console.log(tab, event);
  }
  created() {
    this.flag = true
  }
}
</script>

<style lang="scss" scoped>
.el-tabs{
  width: 100%;
}
</style>
