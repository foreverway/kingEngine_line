<template>
  <div class="page ke-flex bg">
    <div class="body">
      <div class="h3">
        {{ title }}
      </div>
      <div class="block bg">
        <ul>
          <li
            v-for="(item,key) in data"
            :key="key"
          >
            <div
              class="bg ke-flex photo"
            >
              <span
                class="bg"
                :style="{backgroundImage:`url(${require('@/assets/nav/'+item.menuIcon)})`}"
              />
            </div>
            <div class="title">
              {{ item.menuName }}
            </div>
            <div class="content bg">
              <dl
                v-for="(node,index) in item.children"
                :key="index"
                @click="handleGo({sysIndex:key,menuIndex:index})"
              >
                <dt>
                  <span
                    class="bg"
                    :style="{backgroundImage:`url(${require('@/assets/nav/'+node.menuIcon)})`}"
                  />
                  <label>{{ node.menuName }}</label>
                </dt>
              </dl>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
@Component({
})
export default class extends Vue {
  private data:Array<any> = []
     private title:string=''
     async created() {
       await this.load()
       this.title = process.env.VUE_APP_NAME || ''
     }
     private async load() {
       this.data = await AppModule.GetMenus()
     }
     handleGo(obj:any){
       AppModule.SET_SELECT(obj)
       this.$router.push({
         path: '/'
       })
     }
}
</script>
<style lang="scss" scoped>
   .bg{
     background-repeat:no-repeat;
    background-position:center center ;
    background-size:100% 100%;
   }
 .page{
   background-image: url(~@/assets/nav/dhbj.png);
   width:100%;
   height:100%;
   display: flex;
   .body{
     margin-top: -1vh;
     width:58%;
     height:73%;
     .h3{
       font-size: 5.2vh;
       font-weight: 600;
       color: #fff;
       width:100%;
       text-align: center;
       margin-bottom: 3vh;
     }
     .block{
        background-image: url(~@/assets/nav/kuang.png);
        height: calc(100% - 9vh);
        padding: 3vh 3vh;
        ul{
          li{
            $height:12vh;
            height:$height;
            margin-bottom: 3vh;
            > div{float: left;}
            .content{
              height:$height;
              width: calc(100% - 29vh);
              dl{
                height:$height;
                display: flex;
                justify-content: space-between;
                float:left;
                cursor: pointer;
                dt{
                  margin-bottom: 1vh;
                  height:100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: column;
                  label{
                    color:#fff;
                    font-size: 2vh;
                  }
                  span{
                    margin-bottom: 0.7vh;
                    width:5.9vh;
                    height:5.9vh;
                  }
                }
              }
            }
            .photo{
              width:16vh;
              height:$height;
              span{
                height: 5vh;
                width: 5vh;
                margin-left: 1.5vh;
              }
            }
            .title{
              font-size: 2.5vh;
              font-weight: 600;
              color:#fff;
              padding: 0 1vh;
              height:$height;
              line-height: $height;
            }
            &:nth-child(1){
              div.photo{ 
                background-image: url(~@/assets/nav/cgkx.png);
              }
              div.content{ 
                background-image: url(~@/assets/nav/yi.png);
                padding-left: 4vh;
                dl{
                  padding-left: 5vh;
                }
              }
               div.title{
                width:12vh
              }
            }
            &:nth-child(2){
              padding-left: 3.9vh;
              div.photo{ 
                width:14vh;
                background-image: url(~@/assets/nav/kzxt.png);
              }
              div.content{ 
                width:calc(100% - 29vh);
                background-image: url(~@/assets/nav/er.png);
                dl{
                  padding-left: 5vh;
                }
              }
              div.title{
                padding: 0 2vh 0 2vh;
              }
            }
            &:nth-child(3){
              padding-left: 4vh;
              div.photo{ 
                width: 14vh;
                background-image: url(~@/assets/nav/jc.png);
              }
              div.content{ 
                width:calc(100% - 29.3vh);
                background-image: url(~@/assets/nav/san.png);
                dl{
                  padding-left: 4.5vh;
                }
              }
              div.title{
                padding: 0 2vh 0 2.3vh;
              }
            }
            &:nth-child(4){
              div.photo{ 
                background-image: url(~@/assets/nav/zjgk.png);
              }
              div.content{ 
                width: calc(100% - 30.1vh);
                background-image: url(~@/assets/nav/si.png);
                dl{
                  padding-left: 8vh;
                }
              }
              div.title{
                padding: 0 2vh 0 1vh;
              }
            }
          }
        }
     }
   }
 }
 @media screen and (min-width:1890px) {
    .page .body {
    width: 68%;
    }
}
</style>
