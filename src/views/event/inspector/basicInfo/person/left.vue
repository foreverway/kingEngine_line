<template>
  <el-dialog
    v-dialog-drag
    title="离职"
    :visible.sync="dialog.visible"
    class="main-container"
    width="500px"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="离职时间"
        prop="leftTime"
      >
        <el-date-picker
          v-model="formData.leftTime"
          placeholder="请选择离职时间"
          :picker-options="pickerOptions"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        label="离职原因"
        prop="reason"
      >
        <el-input
          v-model="formData.reason"
          placeholder="请选择离职原因"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
    </el-form>
    <div class="opeate-buttons">
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="save" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
@Component({
  name: 'TaskForm',
  components: {
    Basic: () => import('./basic.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: false }) dialog!: any
  private rules:any = {
    leftTime: [
      {
        required: true,
        trigger: 'blur',
        message: '请选择离职时间'
      }
    ],
    reason: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入离职原因'
      }
    ]
  }
  private pickerOptions= {
    // disabledDate(time) {
    //   return time.getTime() > Date.now()
    // },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }]
  }
  private formData: any = {
    leftTime: '',
    reason: ''
  }
  created() {
    if (this.dialog.items){
      let ids: Array<any> = []
      this.dialog.items.forEach((item) => {
        ids.push(item.id)
      })
      this.formData.ids = ids.join(',')
    }
  }
  private handleSave() {
    (this.$refs.form as ElForm).validate((valid) => {
      if (valid){
        this.$http({
          url: '/obs/observer/leftJob',
          method: 'post',
          data: this.formData
        }).then((res) => {
          let dialog = {
            visible: false,
            item: []
          }
          this.$emit('handleInit')
          this.$emit('update:dialog', dialog)
        })
      } else {
        return false
      }
    })

  }
  private handleCancel(): void {
    let dialog = {
      visible: false,
      item: []
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>
<style scoped>

</style>
<style lang="scss" scoped>

.pane-item {
  height: 100%;
}

.opeate-buttons {
  padding-top:10px;
  text-align: right;
}
.tips {
  color: #ff4949;
}

.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
