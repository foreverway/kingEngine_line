<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
    append-to-body
  >
    <ul>
      <li
        v-for="(item,index) in IconClsData"
        :key="index"
        @click="handleSelectIcon(item)"
      >
        <img
          class="pic-404__child left"
          :src="item.url"
        >
      </li>
    </ul>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'IconCls'
})
export default class extends Vue {
    private IconClsData:Array<any>=[
      { 
        url: 'img/pmi/logo.png' ,
        iconName: 'logo'
      },
      { 
        url: 'img/pmi/logo1.png' ,
        iconName: 'logo1'
      }
    ]
    @Prop({ type: Object, default: {} }) dialog !: object
    private handleSelectIcon(item:any) {
      this.$emit('selectIcon', item)
      this.$emit('update:dialog', {visible: false})
    }
}
</script>
<style lang="scss" scoped>
ul{
  display: flex;
  flex-direction: row;
  li{
    cursor: pointer;
    margin: 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    svg{
      width:38px;
      height:38px;
    }
    span{
      margin-top: 7px;
      font-size: 18px;
    }
  }
}
</style>
