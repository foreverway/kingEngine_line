/* eslint-disable no-shadow */
import { DirectiveOptions } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

/**
 * 指令权限
 * @param el
 * @param binding
 */
const bindDragDialog = (el: HTMLElement | any, binding: DirectiveBinding) => {

  // 初始非全屏
  let isFullScreen = false
  // 当前宽高
  let nowWidth = 0
  let nowHeight = 0
  // 当前顶部高度
  let nowMarginTop = 0
  // 获取弹框头部（这部分可双击全屏）
  const dialogHeaderEl: any = el.querySelector('.el-dialog__header')
  // 弹窗
  const dragDom: any = el.querySelector('.el-dialog')

  // 给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
  dragDom.style.overflow = 'auto'
  // 清除选择头部文字效果
  // eslint-disable-next-line no-new-func
  dialogHeaderEl.onselectstart = new Function('return false')
  // 头部加上可拖动cursor
  dialogHeaderEl.style.cursor = 'move'

  // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
  const sty = (function() {
    const body: any = document.body
    if (body.currentStyle) {
      // 在ie下兼容写法
      return (dom: any, attr: any) => dom.currentStyle[attr]
    } 
    return (dom: any, attr: any) => getComputedStyle(dom, 'false')[attr]
    
  })()

  let moveDown = (e: any) => {
    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = e.clientX - dialogHeaderEl.offsetLeft
    const disY = e.clientY - dialogHeaderEl.offsetTop

    const screenWidth = document.body.clientWidth // body当前宽度
    const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

    const dragDomWidth = dragDom.offsetWidth // 对话框宽度
    const dragDomHeight = dragDom.offsetHeight // 对话框高度

    const minDragDomLeft = dragDom.offsetLeft
    const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

    const minDragDomTop = dragDom.offsetTop
    const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

    // 获取到的值带px 正则匹配替换
    let styL = sty(dragDom, 'left')
    // 为兼容ie
    if (styL === 'auto') { 
      styL = '0px' 
    }
    let styT = sty(dragDom, 'top')

    // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    if (styL.includes('%')) {
      styL = Number(document.body.clientWidth) * (Number(styL.replace(/%/g, '')) / 100)
      styT = Number(document.body.clientHeight) * (Number(styT.replace(/%/g, '')) / 100)
    } else {
      styL = Number(styL.replace(/px/g, ''))
      styT = Number(styT.replace(/px/g, ''))
    }

    document.onmousemove = function (e) {
      // 通过事件委托，计算移动的距离
      let left = e.clientX - disX
      let top = e.clientY - disY
      // 边界处理
      if (-(left) > minDragDomLeft) {
        left = -(minDragDomLeft)
      } else if (left > maxDragDomLeft) {
        left = maxDragDomLeft
      }

      if (-(top) > minDragDomTop) {
        top = -(minDragDomTop)
      } else if (top > maxDragDomTop) {
        top = maxDragDomTop
      }

      // 移动当前元素
      dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
    }

    document.onmouseup = function (e) {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
  dialogHeaderEl.onmousedown = moveDown
  // 双击头部效果
  dialogHeaderEl.ondblclick = (e: any) => {
    if (isFullScreen === false) {
      nowHeight = dragDom.clientHeight
      nowWidth = dragDom.clientWidth
      nowMarginTop = dragDom.style.marginTop
      dragDom.style.left = 0
      dragDom.style.top = 0
      dragDom.style.height = '100VH'
      dragDom.style.width = '100VW'
      dragDom.style.marginTop = 0
      isFullScreen = true
      dialogHeaderEl.style.cursor = 'initial'
      dialogHeaderEl.onmousedown = null
    } else {
      dragDom.style.height = 'auto'
      dragDom.style.width = nowWidth + 'px'
      dragDom.style.marginTop = nowMarginTop
      isFullScreen = false
      dialogHeaderEl.style.cursor = 'move'
      dialogHeaderEl.onmousedown = moveDown
    }
  }

}
const power = (path: string, code: string) => {

}

/**
 * 弹框拖拽指令绑定
 */
export const DragDialog: DirectiveOptions = {
  bind (el: any, binding: any) {
    bindDragDialog(el, binding)
  },
  update (el: any, binding: any) {
  },
  unbind (el: any, binding: any) {
    console.log('unbind')
  }
}
