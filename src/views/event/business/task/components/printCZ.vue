<template>
  <el-dialog
    :title="dialog.title"
    width="800px"
    :visible.sync="dialog.visible"
  >
    <div id="printMe">
      <table
        class="kd-table print"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <colgroup>
          <col style="width: 11%;">
          <col style="width: 22%;">
          <col style="width: 11%;">
          <col style="width: 22%;">
          <col style="width: 11%;">
          <col style="width: 23%;">
        </colgroup>
        <tbody>
          <tr>
            <th>案件号：</th>
            <td>深圳城管2019字第8号</td>
            <th>案件来源：</th>
            <td>网站举报</td>
            <th>案件等级：</th>
            <td>一般案件</td>
          </tr>
          <tr>
            <th>案件类别：</th>
            <td>事件/市容环境/私搭乱建</td>
            <th>所属区域：</th>
            <td>龙岗区/南湾/吉厦</td>
            <th>采集员：</th>
            <td>张三</td>
          </tr>
          <tr>
            <th>网格：</th>
            <td>
              44030700400301/44030700400305
            </td>
            <th>上报时间：</th>
            <td>
              2019-09-10 18:42:16
            </td>
            <th>来件时间：</th>
            <td>
              2019-09-10 18:42:16
            </td>
          </tr>
          <tr>
            <th>事发位置：</th>
            <td colspan="5">
              龙岗区南湾吉厦吉厦社区东80.36米
            </td>
          </tr>
          <tr>
            <th>问题描述：</th>
            <td colspan="5">
              测试案件
            </td>
          </tr>
          <tr>
            <td
              class="ke-center"
              colspan="6"
            >
              执行与反馈
            </td>
          </tr>
          <tr>
            <td
              class="ke-center"
              colspan="3"
            >
              处理意见
            </td>
            <td
              class="ke-center"
              colspan="3"
            >
              查处结果
            </td>
          </tr>
          <tr>
            <td
              colspan="3"
            >
              11111
            </td>
            <td
              colspan="3"
            >
              222222
            </td>
          </tr>
          <tr>
            <td
              colspan="3"
              class="ke-center"
            >
              处理前图片
            </td>
            <td
              colspan="3"
              class="ke-center"
            >
              处理后图片
            </td>
          </tr>
          <tr>
            <td
              colspan="3"
              class="ke-center"
              style="height:200px;"
            />
            <td
              colspan="3"
              class="ke-center"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        v-print="'#printMe'"
        :loading="loading"
        type="primary"
        @click="handlePrint"
      >
        <svg-icon name="save" />打 印
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import Print from 'vue-print-nb'
Vue.use(Print)
@Component
export default class extends Vue {
    @Prop()private dialog:any
    private form:any={
      name: '222',
      node: '333'
    }
    created(){
      this.form.name = '张三'
    }
    private handlePrint() {
      setTimeout(() => {
        this.handleCancel()
      },1000)
    }
    private handleCancel(): void {
      this.$emit('update:dialog', {
        visible: false
      })
    }
}
</script>
 
<style lang="scss" scoped>
.print{
  $fontSize:11px;
  font-size: $fontSize;
  td,th{
    font-size: $fontSize;
  }
  th.title{
    font-weight: 600;
    font-size:14px;
    text-align: center;
  }
}
</style>
