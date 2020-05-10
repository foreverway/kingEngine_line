import Vue, { VNode } from 'vue'
import { DirectiveBinding, DirectiveOptions } from 'vue/types/options'
import { ElButton } from 'element-ui/types/button'

// eslint-disable-next-line valid-jsdoc
/** 权限指令**/
const bindBtns: Function = (el: HTMLElement | any, binding: DirectiveBinding, vnode: VNode | any) => {
  // 获取当前路由
  let path = vnode.context.$route.path
  let id = el.id
  if (!isPower(path, id)) {
    if (el.attributes.code !== undefined){
      // console.log(el.attributes.code.value)
      
      // el.remove()
    }
  }
}
// 检查权限
const isPower: Function = (path: string, code: string) => {
  // 获取缓存权限对比（等待接口后完善）
  return false
}
export const Power: DirectiveOptions = {
  bind(el: HTMLElement | any, binding: DirectiveBinding, vnode: VNode | any) {
    
  },
  update(el: HTMLElement | any, binding: DirectiveBinding, vnode: VNode | any) {
    bindBtns(el, binding, vnode)
  },
  unbind(el: any, binding: any) {
  }
}
