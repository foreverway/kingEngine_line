<template>
  <el-dialog
    v-loading="loading"
    :title="dialog.title"
    width="800px"
    :visible.sync="dialog.visible"
  >
    <div id="printMe">
      <table
        v-for="(item,key) in items"
        :key="key"
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
            <th
              class="title"
              colspan="6"
            >
              {{ item.evtCodeStr }}
            </th>
          </tr>
          <tr>
            <th>案件类别：</th>
            <td>{{ item.evtClassName }}</td>
            <th>上报时间：</th>
            <td>{{ item.evtCodeStr }}</td>
            <th>举报人：</th>
            <td>{{ item.reporterName }}</td>
          </tr>
          <tr>
            <th>案件等级：</th>
            <td>{{ item.evtLevelStr }}</td>
            <th>案件来源：</th>
            <td>{{ item.resourceStr }}</td>
            <th>所属区域：</th>
            <td>{{ item.areaNameStr }}</td>
          </tr>
          <tr>
            <th>案发位置：</th>
            <td colspan="5">
              {{ item.evtLocation }}
            </td>
          </tr>
          <tr>
            <th>问题描述：</th>
            <td colspan="5">
              {{ item.content }}
            </td>
          </tr>
          <tr>
            <th>备注：</th>
            <td colspan="5">
              {{ item.note }}
            </td>
          </tr>
          <tr>
            <td
              colspan="2"
              class="ke-center"
            >
              案件位置
            </td>
            <td
              colspan="2"
              class="ke-center"
            >
              处理前图片
            </td>
            <td
              colspan="2"
              class="ke-center"
            >
              处理后图片
            </td>
          </tr>
          <tr>
            <td
              colspan="2"
              class="ke-center"
              style="height:200px;"
            >
              <event-map
                v-if="item.id>0&&item.absX&&item.absY"
                :row="row"
              />
              <div
                v-else
                class="ke-no-data"
              >
                暂无位置信息
              </div>
            </td>
            <td
              colspan="2"
              class="ke-center"
            >
              <img
                v-if="item.annexeBeforeList&&item.annexeBeforeList.length>0"
                class="img"
                :src="item.annexeBeforeList[0].filePath"
              ><div
                v-else
                class="ke-no-data"
              >
                暂无图片
              </div>
            </td>
            <td
              colspan="2"
              class="ke-center"
            >
              <img
                v-if="item.annexeAfterList&&item.annexeAfterList.length>0"
                class="img"
                :src="item.annexeAfterList[0].filePath"
              ><div
                v-else
                class="ke-no-data"
              >
                暂无图片
              </div>
            </td>
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
    private loading:boolean=true
    private items:Array<any>=[{}]
    created(){
      this.$http.post('evt/event/printEvents',{ids: this.dialog.data}).then((res:any) => {
        this.items = res.data
        this.loading = false
      })
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
.printMe{
  height:80vh;
}
.print{
  $fontSize:11px;
  font-size: $fontSize;
  margin-bottom: 10px;
  td,th{
    font-size: $fontSize;
  }
  th.title{
    font-weight: 600;
    font-size:14px;
    text-align: center;
  }
  .img{
    width:200px;
    height:260px;
  }
}
</style>
