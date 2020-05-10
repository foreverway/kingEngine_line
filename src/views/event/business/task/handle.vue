<template>
  <el-dialog
    :title="dialog.title"
    width="1350px"
    :visible.sync="dialog.visible"
  >
    <el-container>
      <el-main>
        <event-details
          :is-case="true"
          :row="row"
        />
      </el-main>
      <el-aside width="43%">
        <div class="body">
          <event-save
            :row="row"
            @close="handleCancel"
          />
        </div>
      </el-aside>
    </el-container>
  </el-dialog>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import KeImages from '@/components/keImages.vue'
import EventDetails from './components/details.vue'

@Component({
  components: {
    KeImages,
    EventDetails,
    EventFlow: () => import('./components/flow.vue'),
    EventSave: () => import('./save.vue'),
    UpdateRows: () => import('./updateRows.vue'),
    knowleDge: () => import('./knowledge.vue'),
    EventCase: () => import('./case.vue')
  }
})
export default class extends Vue {
    @Prop() private dialog:any
    private loading:boolean=false
    private tabs:any = {
      activeName: 'base',
      isFlow: false,
      isUpdate: false,
      isDge: false,
      isCase: false
    }
    private row:any={
      statisticsVO: {
        recordingNum: 0,
        videoNum: 0,
        picNum: 0
      },
      id: 0
    }
    created(){
      this.load()
    }
    load(){
      this.$http.post('evt/event/getToDoEventDetails',{id: this.dialog.data.id}).then((res:any) => {
        this.row = res.data
      })
    }
    handleCancel(){
      this.$emit('update:dialog', {
        visible: false
      })
    }
}
</script>
 
<style lang="scss" scoped>
.el-main,.el-aside{
    padding: 0;
}
.el-aside{
    padding-top: 38px;
    .body{
        height:100%;
        background: #F5F5F5;
        position: relative;
        &::before{
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 2px;
            background-color: #E4E7ED;
            z-index: 1;
        }
    }
}

</style>
