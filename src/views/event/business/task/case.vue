<template>
  <el-container>
    <el-header
      height="auto"
      class="center"
    >
      当前条件：
      <el-select v-model="search.xxx">
        <el-option value="11">
          条件一
        </el-option>
      </el-select>
      <el-popover
        v-model="search.visible"
        placement="bottom-end"
        width="560px"
        class="ke-popover-button"
        trigger="click"
      >
        <div class="ke-popover-center">
          <el-table
            :data="items"
            height="230px"
          >
            <el-table-column
              width="100px"
              align="center"
              prop="name"
              label="字段名"
            />
            <el-table-column
              width="130px"
              align="center"
              prop="val"
              label="取值"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.val" />
              </template>
            </el-table-column>
            <el-table-column
              width="190px"
              align="left"
              header-align="left"
              prop="node"
              label="备注"
            />
            <el-table-column
              width="80px"
              align="center"
              prop="flag"
              label="是否开启"
            >
              <template slot-scope="scope">
                <el-switch v-model="scope.row.flag" />
              </template>
            </el-table-column>
          </el-table>
          <div
            slot="footer"
            class="ke-search-buttons"
          >
            <el-button @click="search.visible = false">
              关 闭
            </el-button>
            <el-button
              type="primary"
              @click="search.visible = false"
            >
              保 存
            </el-button>
          </div>
        </div>
        <el-button
          slot="reference"
          class="button"
          type="primary"
        >
          <svg-icon name="moveSearch" />手动查重
        </el-button>
      </el-popover>
      <el-button
        type=""
        icon="el-icon-document-delete"
        @click="handleOpen"
      >
        直接作废
      </el-button>
    </el-header>
    <el-main>
      <el-row>
        <el-col
          :span="12"
          class="box-card-me"
        >
          <table
            class="kd-table"
            cellspacing="1"
            cellpadding="0"
            border="0"
          >
            <colgroup>                
              <col style="width:25%;">                
              <col style="width:75%;">            
            </colgroup>            
            <tbody>
              <tr>                
                <td colspan="2">
                  <div class="ke-title">
                    原始案件
                  </div>    
                </td>            
              </tr> 
              <tr>                
                <th>案卷编号：</th>                
                <td />            
              </tr>            
              <tr>                
                <th>受理时间：</th>                
                <td>2017-12-01 14:46:26</td>            
              </tr>            
              <tr>                
                <th>问题来源：</th>                
                <td>
                  其它上报                
                </td>            
              </tr>            
              <tr>                
                <th>问题分类：</th>                
                <td>事件/市容环境/焚烧垃圾、树叶</td>            
              </tr>            
              <tr>                
                <th>案件等级：</th>                
                <td>特大案件</td>            
              </tr>            
              <tr>                
                <th>关键字：</th>                
                <td />            
              </tr>            
              <tr>                
                <th>事发位置：</th>                
                <td>龙岗区宝龙比宝一路长箭北143.00米</td>            
              </tr>            
              <tr>                
                <th>问题描述：</th>                
                <td>鱼</td>            
              </tr>            
              <tr>
                <th>
                  备注：
                </th>                
                <td />
              </tr>            
              <tr>
                <th>
                  处理前
                </th>                
                <td>                    
                  <div id="Prev" />                
                </td>
              </tr>            
              <tr>
                <th>
                  处理后
                </th>                
                <td>                    
                  <div id="Next" />                
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col
          :span="12"
          class="box-card-ole"
        >
          <table
            class="kd-table"
            cellspacing="1"
            cellpadding="0"
            border="0"
          >
            <colgroup>                
              <col style="width:26%;">                
              <col style="width:74%;">            
            </colgroup>            
            <tbody>
              <tr>                
                <td colspan="2">
                  <div class="ke-title">
                    疑似案件
                    <el-pagination
                      :current-page="1"
                      :page-size="1"
                      layout="total, prev, next"
                      :total="10"
                      :pager-count="5"
                    />
                  </div> 
                </td>            
              </tr> 
              <tr>                
                <th>案卷编号：</th>                
                <td />            
              </tr>            
              <tr>                
                <th>受理时间：</th>                
                <td>2017-12-01 14:46:26</td>            
              </tr>            
              <tr>                
                <th>问题来源：</th>                
                <td>
                  其它上报                
                </td>            
              </tr>            
              <tr>                
                <th>问题分类：</th>                
                <td>事件/市容环境/焚烧垃圾、树叶</td>            
              </tr>            
              <tr>                
                <th>案件等级：</th>                
                <td>特大案件</td>            
              </tr>            
              <tr>                
                <th>关键字：</th>                
                <td />            
              </tr>            
              <tr>                
                <th>事发位置：</th>                
                <td>龙岗区宝龙比宝一路长箭北143.00米</td>            
              </tr>            
              <tr>                
                <th>问题描述：</th>                
                <td>鱼</td>            
              </tr>            
              <tr>
                <th>
                  备注：
                </th>                
                <td />
              </tr>            
              <tr>
                <th>
                  处理前
                </th>                
                <td>                    
                  <div id="Prev" />                
                </td>
              </tr>            
              <tr>
                <th>
                  处理后
                </th>                
                <td>                    
                  <div id="Next" />                
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      :title="dialog.title"
      :append-to-body="true"
      :visible.sync="dialog.visible"
      width="450px"
    >
      <span>
        <ke-commonly
          v-if="dialog.visible"
          ref="word"
          v-model="form.word"
          class="commonly"
          :is-top="false"
        />
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialog.visible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  components: {
    keCommonly: () => import('@/components/keCommonly.vue')
  }
})
export default class extends Vue {
    private dialog: any = {
      title: '',
      visible: false
    }
    private search: any ={ }
    private form: any ={ 
      word: ''
    }
    private items:Array<any>=[
      {name: '类型',val: '',node: '类型是否相同',flag: true},
      {name: '大类',val: '',node: '大类是否相同',flag: false},
      {name: '小类',val: '',node: '小类是否相同',flag: false},
      {name: '时间范围',val: '2',node: '此案件上报前后时间范围，单位为天',flag: true},
      {name: '关键字',val: '行道树',node: '案件关键字',flag: true},
      {name: '坐标',val: '',node: '此案件坐标范围，单位为米',flag: false}
    ]
    handleClick(){

    }
    handleOpen(){
      this.dialog.visible = true
      this.dialog.title = '案件作废'
      this.form.word = ''
    }
    handleSubmit(){
      if (this.form.word.trim().length === 0){
        (this.$refs.word as any).handleFocus()
        this.$base.win.msg('请输入作废意见！')
        return
      }
      this.$base.win.msg('案件作废成功！','success')
      this.dialog.visible = false
      this.form.word = ''
    }
}
</script>
 
<style lang="scss" scoped>
.center{
    text-align: center;
    .el-select{
        width:160px!important;
    }
}
.el-container{
    height:99%;
    .el-main{
        overflow:auto;
        padding:0px 15px 0 0;
        .el-row{
            margin-top: 15px;
        } 
        .el-col-12{
            .ke-title{
                height: 20px;
                line-height: 20px;
                padding: 0;
                .el-pagination{
                    width:auto;
                    display: inline-block;
                    position: relative;
                    top: -5px;
                    right: 0;
                    left: 130px;
                }
            }
            > div > div{
                font-weight: 600;
            }
        }
        .box-card-ole{
            padding-left: 15px;
        }
    }
}
</style>
