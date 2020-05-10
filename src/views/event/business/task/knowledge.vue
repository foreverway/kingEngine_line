<template>
  <table
    v-loading="loading"
    class="kd-table"
    style="width:calc(100% - 15px);"
  >
    <colgroup>
      <col style="width:20%;">
      <col style="width:80%;">
    </colgroup>
    <tbody>
      <tr>
        <th>案件所属类别：</th>
        <td>
          {{ item.evtClassNames }}
        </td>
      </tr>
      <tr>
        <th>核实/核查时限：</th>
        <td>{{ item.verifyLimit }}</td>
      </tr>
      <tr>
        <th>默认处置单位：</th>
        <td>
          {{ item.defaultDept }}
        </td>
      </tr>
      <tr>
        <th>处理时限：</th>
        <td>
          {{ item.disposeLimitList }}
        </td>
      </tr>
      <tr>
        <th>立案标准：</th>
        <td>
          {{ item.registerGuide }}
        </td>
      </tr>
      <tr>
        <th>结案标准：</th>
        <td>
          {{ item.closeGuide }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang='ts'> 
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component
export default class extends Vue {
    private loading: boolean = true
    private item: any = {}
     @Prop({default: 0}) private id!:number
     private created(){
       this.load()
     }
     private load(){
       this.$http.post('evt/eventQuery/findEventKnows',{id: this.id}).then((res:any) => {
         this.item = res.data
         this.loading = false
       })
     }
}
</script>
 
<style lang="scss" scoped>

</style>
