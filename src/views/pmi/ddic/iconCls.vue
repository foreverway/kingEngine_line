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
          :src="`${require('@/assets/dataDictionary/'+item.iconName)}`"
        >
        <span>{{ item.iconName }}</span>
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
        url: 'assets/dataDictionary/12319zhuanban.png' ,
        iconName: '12319zhuanban.png'
      },
      { 
        url: 'assets/dataDictionary/chaweipingtai.png' ,
        iconName: 'chaweipingtai.png'
      },
      { 
        url: 'assets/dataDictionary/chengshiguanjia.png' ,
        iconName: 'chengshiguanjia.png'
      },
      { 
        url: 'assets/dataDictionary/chuangwenbanzhuanban.png' ,
        iconName: 'chuangwenbanzhuanban.png'
      },
      { 
        url: 'assets/dataDictionary/chuanzhenjubao.png' ,
        iconName: 'chuanzhenjubao.png'
      },
      { 
        url: 'assets/dataDictionary/duanxinjubao.png' ,
        iconName: 'duanxinjubao.png'
      },
      { 
        url: 'assets/dataDictionary/gongzhongjubao.png' ,
        iconName: 'gongzhongjubao.png'
      },
      { 
        url: 'assets/dataDictionary/jiufengzaixian.png' ,
        iconName: 'jiufengzaixian.png'
      },
      { 
        url: 'assets/dataDictionary/kaopingjubao.png' ,
        iconName: 'kaopingjubao.png'
      },
      { 
        url: 'assets/dataDictionary/lingdaopishi.png' ,
        iconName: 'lingdaopishi.png'
      },
      { 
        url: 'assets/dataDictionary/meitibaoguang.png' ,
        iconName: 'meitibaoguang.png'
      },
      { 
        url: 'assets/dataDictionary/qitashangbao.png' ,
        iconName: 'qitashangbao.png'
      },
      { 
        url: 'assets/dataDictionary/shipindengji.png' ,
        iconName: 'shipindengji.png'
      },
      { 
        url: 'assets/dataDictionary/suishoupai.png' ,
        iconName: 'suishoupai.png'
      },
      { 
        url: 'assets/dataDictionary/wanggeyuanhsangbao.png' ,
        iconName: 'wanggeyuanhsangbao.png'
      },
      { 
        url: 'assets/dataDictionary/wangzhanqubao.png' ,
        iconName: 'wangzhanqubao.png'
      },
      { 
        url: 'assets/dataDictionary/weixin.png' ,
        iconName: 'weixin.png'
      },
      { 
        url: 'assets/dataDictionary/xinfangjubao.png' ,
        iconName: 'xinfangjubao.png'
      },
      { 
        url: 'assets/dataDictionary/xunchayuanshangabo.png' ,
        iconName: 'xunchayuanshangabo.png'
      },
      { 
        url: 'assets/dataDictionary/xunchayuanzijiu.png' ,
        iconName: 'xunchayuanzijiu.png'
      },
      { 
        url: 'assets/dataDictionary/youjianqubao.png' ,
        iconName: 'youjianqubao.png'
      },
      { 
        url: 'assets/dataDictionary/zhinengbujian.png' ,
        iconName: 'zhinengbujian.png'
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
  // display: flex;
  flex-direction: row;
  max-height: 500px;
  overflow: auto;
  margin-top: 10px;
  li{
    cursor: pointer;
    margin: 10px 15px;
    display: inline-block;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
    text-align: center;
    height: 100px;
    vertical-align: middle;
    img{
      margin-bottom: 5px;
    }
    svg{
      width:38px;
      height:38px;
    }
    span{
      margin-top: 7px;
      font-size: 18px;
      display: block;
    }
  }
}
</style>
