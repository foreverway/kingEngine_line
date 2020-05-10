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
        url: require('@/assets/nav/ch.png'),
        src: '/assets/nav/ch.png',
        iconName: 'ch.png'
      },
      { 
        url: require('@/assets/nav/kz.png'),
        src: '/assets/nav/kz.png',
        iconName: 'kz.png'
      },
      { 
        url: require('@/assets/nav/sj.png'),
        src: '/assets/nav/sj.png',
        iconName: 'sj.png'
      },
      { 
        url: require('@/assets/nav/zn.png'),
        src: '/assets/nav/zn.png',
        iconName: 'zn.png'
      },
      { 
        url: require('@/assets/nav/fwrx.png'),
        src: '/assets/nav/fwrx.png',
        iconName: 'fwrx.png'
      },
      { 
        url: require('@/assets/nav/jcsj.png'),
        src: '/assets/nav/jcsj.png',
        iconName: 'jcsj.png'
      },
      { 
        url: require('@/assets/nav/jdygl.png'),
        src: '/assets/nav/jdygl.png',
        iconName: 'jdygl.png'
      },
      { 
        url: require('@/assets/nav/jdzh.png'),
        src: '/assets/nav/jdzh.png',
        iconName: 'jdzh.png'
      },
      { 
        url: require('@/assets/nav/mhwz.png'),
        src: '/assets/nav/mhwz.png',
        iconName: 'mhwz.png'
      },
      { 
        url: require('@/assets/nav/mqsb.png'),
        src: '/assets/nav/mqsb.png',
        iconName: 'mqsb.png'
      },
      { 
        url: require('@/assets/nav/qsjk.png'),
        src: '/assets/nav/qsjk.png',
        iconName: 'qsjk.png'
      },
      { 
        url: require('@/assets/nav/sjjh.png'),
        src: '/assets/nav/sjjh.png',
        iconName: 'sjjh.png'
      },
      { 
        url: require('@/assets/nav/xtgz.png'),
        src: '/assets/nav/xtgz.png',
        iconName: 'xtgz.png'
      },
      { 
        url: require('@/assets/nav/ywdx.png'),
        src: '/assets/nav/ywdx.png',
        iconName: 'ywdx.png'
      },
      { 
        url: require('@/assets/nav/ywsl.png'),
        src: '/assets/nav/ywsl.png',
        iconName: 'ywsl.png'
      },
      { 
        url: require('@/assets/nav/yywh.png'),
        src: '/assets/nav/yywh.png',
        iconName: 'yywh.png'
      },
      { 
        url: require('@/assets/nav/zfhm.png'),
        src: '/assets/nav/zfhm.png',
        iconName: 'zfhm.png'
      },
      { 
        url: require('@/assets/nav/zhjg.png'),
        src: '/assets/nav/zhjg.png',
        iconName: 'zhjg.png'
      },
      { 
        url: require('@/assets/nav/zhld.png'),
        src: '/assets/nav/zhld.png',
        iconName: 'zhld.png'
      },
      { 
        url: require('@/assets/nav/zhpj.png'),
        src: '/assets/nav/zhpj.png',
        iconName: 'zhpj.png'
      },
      { 
        url: require('@/assets/nav/zhyl.png'),
        src: '/assets/nav/zhyl.png',
        iconName: 'zhyl.png'
      },
      { 
        url: require('@/assets/nav/cljk.png'),
        src: '/assets/nav/cljk.png',
        iconName: 'cljk.png'
      },
      { 
        url: require('@/assets/nav/cgt.png'),
        src: '/assets/nav/cgt.png',
        iconName: 'cgt.png'
      },
      { 
        url: require('@/assets/nav/dlbm.png'),
        src: '/assets/nav/dlbm.png',
        iconName: 'dlbm.png'
      },
      { 
        url: require('@/assets/nav/spjk.png'),
        src: '/assets/nav/spjk.png',
        iconName: 'spjk.png'
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
      width:60px;
      height:60px;
    }
    span{
      margin-top: 7px;
      font-size: 18px;
      display: block;
    }
  }
}
</style>
