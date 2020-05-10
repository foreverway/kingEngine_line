<template>
  <el-container class="personal-info-wrapper">
    <el-header height="auto">
      <el-form
        :model="params"
        class="ke-search"
      >
        <el-input 
          v-model="params.bb1" 
          placeholder="请输入内容" 
          class="input-with-select"
        >
          <el-select 
            slot="prepend" 
            v-model="params.select" 
            placeholder="请选择"
          >
            <el-option 
              label="兴趣点" 
              value="1" 
            />
            <el-option 
              label="道路" 
              value="2" 
            />
          </el-select>
          <el-button 
            slot="append" 
            icon="el-icon-search" 
          />
        </el-input>
      </el-form>
    </el-header>
    <el-main class="personal-info-wrapper">
      <span 
        v-if="resultSet.length == 0" 
        class="ka-result"
      >
        使用上面的查询框，根据名称来查询要素
      </span>
      <ul>
        <li
          v-for="item in resultSet"
          :key="item.id"
          class="ka-list"
        > 
          <i class="el-icon-location-information el-icon--right" />
          <div>
            <div>名称：{{ item.name }}</div>
            <div>详细地址：{{ item.adress }}</div>
          </div>
        </li>
      </ul>
    </el-main>
    <el-footer 
      v-if="resultSet.length != 0" 
      height="auto" 
    >
      <el-pagination
        background
        class="ke-page"
        layout="prev, pager, next,total,jumper"
        :total="total"
        :current-page.sync="params.page"
        :page-size.sync="params.rows"
        @current-change="handlePage"
      />
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'PersonalInfo'
})
export default class extends Vue {
  // @Prop() private queryResults!:any
  private params: any = {}
  private resultSet: Array<any> = []
  private total: number = 0

  created() {
    // UserModule.GetUserInfo(userName)
    // this.getUserInfo(UserModule.userId)
    this.resultSet = [{
      name: '中国电信南屏湾仔客服中心',
      adress: '中盛路６４号邮电大楼１楼',
      log: 108.349598,
      lat: 21.612477,
      id: 1
    },{
      name: '中国联通中兴南营业厅',
      adress: '江湾三路１５３',
      log: 108.367966,
      lat: 21.628435,
      id: 2
    }]
  }
  private handlePage(currentPage: number): void {
    
  }
  private searcContent(data: string): void {
    this.$emit('setQueryResults', this.resultSet)
    this.resultSet = [{
      name: '中国电信南屏湾仔客服中心',
      adress: '中盛路６４号邮电大楼１楼',
      log: 108.354748,
      lat: 21.633063,
      id: 1
    },{
      name: '中国联通中兴南营业厅',
      adress: '江湾三路１５３',
      log: 108.352688,
      lat: 21.596836,
      id: 2
    }]
  }
}
</script>
<style lang="scss">
.personal-info-wrapper{
  .el-input-group__prepend {
    .el-select{
      margin-right: 0px;
    }
  }
  .el-input-group__prepend{
    padding: 0 5px;
  }
  .el-select {
    .el-input {
      width: 90px;
    }
  }
  .input-with-select {
    .el-input-group__prepend {
      background-color: #fff;
    }
  }
}
.screeningConditions{
  .el-input{
    width: 50%!important;
  }
}
</style>
<style lang="scss" scoped>
.personal-info-wrapper{
    .el-header{
      padding: 0px;
    }
    padding: 0px;
    .ka-result{
      color: #999;
      line-height: 20px;
    }
    .ka-list{
      padding: 5px;
      display: flex;
      line-height: 20px;
      border-bottom: 1px solid #E4E7ED;
      i{
        font-size: 26px;
        color: #409EFF;
        align-self: center;
        margin-right: 5px;
      }
    }
    .ka-list:hover{
      background: #EBEEF5;
      padding: 5px;
    }
  }
  .screeningConditions{
    margin-top: 10px;
  }
</style>
