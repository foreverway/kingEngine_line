<template>
  <div
    v-loading="loading"
    class="agenda-wrapper ke-body"
  >
    <p>请选择所需拆分限制的待办环节：</p>
    <el-checkbox-group
      v-model="checkedWorks"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox
        v-for="item in worksList"
        :key="item.id"
        :label="item.id"
      >
        {{ item.wtName }}
      </el-checkbox>
    </el-checkbox-group>
    <div class="operate-buttons">
      <el-button
        type="primary"
        @click="handleCheckAll"
      >
        全选
      </el-button>
      <el-button
        type="primary"
        @click="handleCancel"
      >
        取消全选
      </el-button>
    </div>
    <p>建议设置刷新时间为10分钟，如果不需要自动刷新，请输入0.</p>
    <div class="time">
      自动刷新待办列表时间为
      <el-input
        v-model="refreshEventTime"
        type="number"
      />
      分钟
    </div>
    <div class="operate-buttons">
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="edit" />
        保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'Agenda'
})
export default class extends Vue {
  private loading: boolean = false
  private checkedWorks: Array<any> = []
  private worksList: Array<any> = []
  private works: Array<any> = []
  private input: string = ''
  private refreshEventTime: number = 0
  created() {
    this.initCheckedWorks()
    this.initAllWorks()
  }
  private initAllWorks(): void {
    this.$http.request({
      url: '/workTache/findAllWorkTaches',
      method: 'get',
      data: {}
    }).then((res: any) => {
      this.worksList = res.rows
      if (this.worksList && this.worksList.length) {
        this.worksList.forEach((el) => {
          this.works.push(el.id)
        })
      }
    })
  }
  private initCheckedWorks(): void {
    this.$http.request({
      url: '/workTache/findSelectedWorkTaches',
      method: 'get',
      data: {}
    }).then((res: any) => {
      let data = res.rows
      if (data && data.length) {
        data.forEach((el: any) => {
          this.checkedWorks.push(el.id)
        })
      }
    })
  }
  private handleCheckedCitiesChange(value: any): void {
    let checkedCount = value.length
    // console.log(value)
  }
  private handleCheckAll(): void { // 全选
    this.checkedWorks = this.works
  }
  private handleCancel(): void { // 取消全选
    this.checkedWorks = []
  }
  private handleSave(): void {
    // console.log('保存')
    if (this.checkedWorks.length) {
      this.loading = true
      let str = ''
      str = this.checkedWorks.join(',')
      // console.log(str)
      this.$http.request({
        url: '/user/addOrUpdateToDoConfig',
        method: 'post',
        data: {
          ids: str,
          refreshEventTime: this.refreshEventTime
        }
      }).then((res: any) => {
        // console.log(res)
        this.loading = false
        this.$base.win.msg('保存成功', 'error')
      })
    } else {
      this.$base.win.msg('请至少勾选一个用于显示的环节！', 'error')
    }
  }
}
</script>
<style lang="scss" scoped>
.agenda-wrapper{
  // width: 100%;
  // height: 100%;
  // background: #fff;
  // border-radius: 4px;
  // padding: 20px;
  // box-sizing: border-box;
  color: #4a5460;
  .el-checkbox-group{
    width: 80%;
    margin: 0 auto;
    .el-checkbox{
      margin-bottom: 10px;
    }
  }
  .operate-buttons{
    display: flex;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .time{
    width: 80%;
    margin: 0 auto;
    margin-top: 15px;
    .el-input{
      width: 100px;
    }
  }
}
</style>
