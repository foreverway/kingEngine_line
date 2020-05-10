<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="660px"
    :append-to-body="true"
  >
    <el-scrollbar class="tree-container">
      <el-tree
        ref="tree"
        :data="menusData"
        :props="props"
        node-key="id"
        :default-checked-keys="checkedKeys"
        :default-expanded-keys="checkedKeys"
        show-checkbox
        @check-change="handleCheck"
      />
    </el-scrollbar>
    <div
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="hamburger" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Array, default: [] }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: object
  private menusData: Array<any> = [
    {
      text: '图片',
      children: [
        {
          text: '美术'
        }
      ]
    },
    {
      text: '音乐',
      children: [
        {
          text: 'heiyou'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    }
  ]
  // 默认选中的
  private checkedKeys: Array<any> = []
  public $refs: any = { quickEntry: HTMLFormElement }
  private props: object = {
    label: 'text',
    children: 'children'
  }
  private handleCheck(data: any) {
    let arr = this.$refs.tree.getCheckedNodes()
  }
  private handleSave(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
    let arr = this.$refs.tree.getCheckedNodes()
    this.$emit('update:selectionItem', arr)
    console.log(arr)
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
.tree-container {
  height: 380px;
}
</style>
