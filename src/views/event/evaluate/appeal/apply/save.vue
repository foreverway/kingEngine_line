<template>
  <div class="form">
    <div class="save">
      <table
        class="kd-table table"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <colgroup>
          <col style="width:18%;">
          <col style="width:82%;">
        </colgroup>
        <tbody>
          <tr>
            <th>申诉类型：</th>
            <td>公众申诉超期结案 </td>
          </tr>
          <tr>
            <th>申诉日期：</th>
            <td>2020-04-16 00:00:00 </td>
          </tr>
          <tr>
            <th>申诉人员：</th>
            <td>某人员</td>
          </tr>
          <tr>
            <th>申诉部门：</th>
            <td>某部门</td>
          </tr>
          <tr>
            <th>申诉理由：</th>
            <td>开展工作时公众配合度不高，已请示后续处理</td>
          </tr>
        </tbody>
      </table>
      <el-table
        class="apply-el-table"
        :data="items"
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
        />
        <el-table-column
          prop="receiveTime"
          label="申诉人员"
        />
        <el-table-column
          prop="tacheName"
          label="申诉时间"
        />
        <el-table-column
          prop="evtClassName"
          label="申诉类型"
        />
        <el-table-column
          prop="location"
          label="审批人"
          show-overflow-tooltip
        />
        <el-table-column
          prop="content"
          label="审批时间"
          show-overflow-tooltip
        />
        <el-table-column
          prop="content"
          label="审批意见"
          show-overflow-tooltip
        />
        <el-table-column
          prop="content"
          label="审批结果"
          show-overflow-tooltip
        />
      </el-table>
      <el-divider
        content-position="left"
        class="title"
      >
        审批意见
      </el-divider>
      <ke-commonly
        ref="word"
        v-model="form.word"
        class="commonly"
      />
    </div>
    <div
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        关闭
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit()"
      >
        通过
      </el-button>
      <el-button
        :loading="loading"
        type="danger"
        @click="handleSubmit()"
      >
        不通过
      </el-button>
      <el-button>
        刷新
      </el-button>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  components: {
    keCommonly: () => import('@/components/keCommonly.vue')
  }
})
export default class extends Vue {
  private loading:boolean = false
  private form:any={
    word: ''
  }
  private items: any = []
  handleCancel() {
    this.$emit('close')
  }
  handleSubmit(){
    if (this.form.word.trim().length === 0){
      (this.$refs.word as any).handleFocus()
      this.$base.win.msg('请输入办理意见！')
      return
    }
    this.$base.win.msg('办理成功！','success')
    this.$emit('close')
  }
}
</script>
 
<style lang="scss">
.apply-el-table thead tr th{
  background: #fff!important;
}
</style>

<style lang="scss" scoped>
  .form{
    height:100%;
    position: relative;
    overflow: hidden;
    .ke-dialog-footer{
      height: 56px;
      line-height: 56px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
       border-top:1px solid  #D3D3D3 ;
    }
  .save{
    padding: 10px 20px 0 20px;
    overflow: auto;
    height:calc(510px - 60px);
    .commonly{
      margin-bottom: 20px;
    }
    .files{
      background: #fff;
      padding: 20px;
      border:1px solid  #D3D3D3 ;
      overflow: auto;
      max-height: 192px;
    }
    table{
      border-color:  #e5e5e5;
      tr{
         border-color:  #e5e5e5;
      }
      th{
        background:  #ECECEC ;
      }
      td{
        background: #fff;
        .select,input{
          width: 50%!important;
        }
      }
    }
    .el-divider{
      margin: 25px 0 20px 0;
      > div{
        font-size: 16px;
        font-size: 600;
        background: #f5f5f5;
      }
    }
  }
  }
  @media (min-width: 1400px) { 
  .form{.save{
    height:calc(820px - 60px);
  }
  }
 }
 .el-table{
   margin-top: 15px;
 }
</style>
