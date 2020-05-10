<template>
  <el-form>
    <el-form-item
      label="消息内容："
      prop="groupName"
    >
      <el-input
        v-model="message"
        type="textarea"
        placeholder="请输入消息内容"
        :rows="2"
        resize="none"
        height="50px"
        maxlength="250"
        show-word-limit
      />
    </el-form-item>
    <el-form-item>
      <el-radio
        v-model="radio"
        label="通讯消息形式发送"
      >
        通讯消息形式发送
      </el-radio>
      <el-radio
        v-model="radio"
        label="通讯消息形式发送"
      >
        移动短信形式发送
      </el-radio>
    </el-form-item>
    <el-form-item center>
      <el-button>关闭</el-button>
      <el-button type="primary">
        发送
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'TaskForm'
})
export default class extends Vue {
  private radio: any = ''
  private message: any = ''
}
</script>
