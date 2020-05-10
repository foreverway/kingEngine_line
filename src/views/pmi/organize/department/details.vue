<template>
  <div>
    <el-dialog
      v-dialog-drag
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="tableData"
        label-width="100px"
        class="ka-form"
      >
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-col :span="24">
                  <el-form-item
                    label="部门名称："
                    prop="deptName"
                  >
                    {{ tableData.deptName }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="所属区域："
                    prop="areaId"
                  >
                    {{ tableData.areaName }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="部门类型："
                    prop="deptType"
                  >
                    <!-- <ke-dict 
                      v-model="tableData.deptType" 
                      code="sectorType"
                    /> -->
                    {{ tableData.deptType }}
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="图片："
                  prop="img"
                >
                  <ke-files
                    ref="filesIds"
                    class="kd-filesTextCenter"
                    :data.sync="tableData.img"
                    :ids.sync="tableData.logoId"
                    :accept="['.jpg','.png','.jpeg','.gif']"
                    :limit="1"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="上级部门："
              prop="parentId"
            >
              {{ tableData.parentName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="排序号："
              prop="orderNo"
            >
              {{ tableData.orderNo }}
            <!-- <span class="tips">* 数字越大，排序越后</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="部门编码："
              prop="deptCode"
            > 
              {{ tableData.parentCode }}{{ tableData.deptCode }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="mb10"
              label="部门图标："
              prop="deptIcon"
            >
              {{ tableData.deptIcon }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="备注："
          prop="note"
        >
          {{ tableData.note }}
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button
          @click="cancel"
        >
          <svg-icon name="close" />取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import IDict from '@/interface/dict'
@Component({
  components: {}
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  // @Prop({ type: Boolean, default: false }) visible !: boolean
  // @Prop({ type: String, default: '' }) title !: string
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = {}
  private rules:object = {
    parentId: [
      { required: true, message: '请选择部门', trigger: 'change' }
    ],
    deptName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入部门名称', trigger: 'change' }
    ],
    deptCode: [
      { required: true,pattern: '[^ \x22]+', trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      {            
        validator(rule,value,callback){            
          if (Number.isInteger(Number(value)) && (Number(value) > 0 || Number(value) === 0)){                
            callback()
          } else {                 
            callback(new Error('请输入大于等于0的数字'))           
          }             
        },             
        trigger: 'change'          
      }
    ],
    departIcon: [
      { required: true,pattern: '[^ \x22]+', message: '请输入部门图标', trigger: 'change' }
    ]
  }
  async created() {
    this.load()
  }
  private load(): void {
    this.$http
      .request({
        url: `pmi/department/${this.id}`,   
        method: 'get',
        params: {id: this.id}
      })
      .then(async(res: any) => {
        if (res.code === 200){
          this.tableData = res.data
          this.tableData.deptCode = this.tableData.deptCode.replace(this.tableData.parentCode,'')
          this.tableData.img = []
          if (this.tableData.logoUrl) {
            this.tableData.img = [{name: 'xx.png',id: this.tableData.logoId,url: this.tableData.logoUrl}]
          }
          let val = await this.$base.dict.dictByCode('sectorType',this.tableData.deptType)
          this.tableData.deptType = val.dictName
        } 
      })
  }
  private cancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }

}
</script>
<style lang="scss">
  .ka-form{
    .el-upload--picture-card{
      display: none;
    }
  }
</style>
<style lang="scss" scoped>
  .mb10{
    margin-bottom: 10px;
  }
  .selectIcon{
    cursor: pointer;
  }
  // .el-tabs__content{
  //   padding: 0 40px;
  //   box-sizing: border-box;
  //   height: 350px;
  // }
</style>
