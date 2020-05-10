<template>
  <el-popover
    v-model="visible"
    placement="bottom-end"
    width="790"
    class="ke-popover-button"
    trigger="manual"
  >
    <div class="ke-popover-center">
      <el-form
        :model="search"
        class="ke-search"
        label-width="77px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="问题来源">
              <ke-dict
                v-model="search.evtResource"
                code="evtSource"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="监督员">
              <ke-set
                v-model="search.observerId"
                path="observer"
                title="选择监督员"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属区域">
              <ke-tree
                v-model="search.evtAreaId"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="来件时间">
              <el-date-picker
                v-model="search.receiveTimeStart"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="至"
              class="ke-center"
            >
              <el-date-picker
                v-model="search.receiveTimeEnd"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件类别">
              <el-cascader
                v-model="search.evtClassId"
                :show-all-levels="false"
                :options="ajlxArray"
                :props="{value:'id',label:'text'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="举报人">
              <el-input v-model="search.reporterName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="举报号码"
            >
              <el-input v-model="search.reporterTel" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件等级">
              <ke-dict
                v-model="search.evtLevel"
                code="evtLevel"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上报时间">
              <el-date-picker
                v-model="search.reportTimeStart"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="至"
              class="ke-center"
            >
              <el-date-picker
                v-model="search.reportTimeEnd"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案发位置">
              <el-input v-model="search.evtLocation" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述">
              <el-input v-model="search.content" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="ke-search-buttons"
      >
        <el-button @click="visible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="handleSearch"
        >
          查 询
        </el-button>
      </div>
    </div>
    <el-button
      slot="reference"
      class="button"
      :type="type"
      @click="visible = true"
    >
      <svg-icon name="moveSearch" />高级查询
    </el-button>
  </el-popover>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import KeSet from '@/components/set/keSet.vue'
@Component({
  components: {   
    KeSet
  }
})
export default class extends Vue {
    @Prop({ type: Object, default: {} }) search !: any
    @Prop({default: 'success'})private type:any
    private visible:boolean = false
    private ajlxArray:Array<any>=[]
    created(){
      this.$http.post('evt/class/findEventClassTree',{
        nextTacheStr: 'InitialState'
      }).then((res: any) => {
        this.ajlxArray = res.data
      })
    }
    handleSearch(){
      this.$emit('search')
      this.visible = false
    }
}
</script>
<style scoped>
.button{
  padding: 10px!important;
}
</style>
