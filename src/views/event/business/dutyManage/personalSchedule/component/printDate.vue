<template>
  <el-dialog
    :visible.sync="dialog.visible"
    :fullscreen="true"
  >
    <div id="printTable">
      <h3>
        {{ printDate.date[0] }}&nbsp;至&nbsp;{{ printDate.date[1] }}值班表
      </h3>
      <el-calendar
        v-model="value"
        class="g_p_b_date"
      >
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <div
            v-if="dayDatas[data.day]"
            class="col"
            @click.stop
          >
            <p>{{ data.day.split('-').slice(1).join('-') }}</p>
            <div
              v-for="(item,key) in dayDatas[data.day]"
              :key="key"
              class="content"
            >
              <div class="title">
                <label>{{ item.opWorkNoName }}</label>
              </div>
              <div
                :id="'col-'+data.day+'-'+key"
                class="body"
              >
                {{ item.opScheduleNames }}
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
    <div class="ke-dialog-footer">
      <el-button @click="handleCancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        v-print="'#printTable'"
        type="primary"
      >
        <svg-icon name="save" />打 印
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Print from 'vue-print-nb'
Vue.use(Print)
@Component({
  name: 'printDate'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog !: any
  @Prop({ type: Object, default: {} }) printDate !: any
  @Prop({ type: Object, default: {} }) dayDatas !: any
  private value:any =this.printDate.date[0]
  private handleCancel(): void {
    this.$emit('update:dialog', {
      visible: false
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar__header{
    display: none
  }
.ke-dialog-footer{
  padding-top: 20px;
  padding-right: 30px;
}
h3{
  text-align: center;
  color: #212121;
}
.col{
  display: flex;
  flex-direction: column;
  height: 100%;
  &.none{
    height:auto;
  }
  p{
    padding: 7px 0px;
    text-align: center;
    color:#333;
    font-weight: 600;
    display: inline-block;
  }
  .content:nth-child(2){
    background: #ffedb2;
    div{
      color:#E5A434;
    }
  }
  .content:nth-child(3){
    background: #b3dcff;
    div{
      color:#028CFF;
    }
  }
  .content:nth-child(4){
    background: #f4d6ff;
    div{
      color:#DA76FF;
    }
  }
  .content{
    display: flex;
    height:50px;
    .title{
      width:30px;
      text-align:center;
      display: flex;
      align-items: center;
      justify-content: center;
      color:#666;
      label{
        display: inline-block;
        width: 20px;
      }
    }
    .body{
      height:100%;
      overflow: auto;
      line-height: 22px;
      padding: 5px;
    }
  }
}
.pl0{
  padding-left: 0!important;
}
</style>

