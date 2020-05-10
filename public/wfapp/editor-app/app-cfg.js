/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

var ACTIVITI = ACTIVITI || {}

// 生产环境下,配置后端的url
let baseURI = sessionStorage.getItem('baseURL').substr(0, sessionStorage.getItem('baseURL').length - 1) // 后端数据请求url配置

// 从缓存读取baseUrl
// baseURI = window.sessionStorage.getItem('baseURL');

let frontURI = window.location.href // 前端url自动获取,使用window.location.href
frontURI = splitUrl(frontURI)
baseURI = baseURI ? baseURI : window.location.origin// 若未配置后端数据请求url，默认使用window.location.origin

ACTIVITI.CONFIG = {
  contextRoot: baseURI,
  jsonUrl: frontURI + '/wfapp/editor-app/stencilset.json',
  viewUrl: frontURI + '/wfapp/editor-app/stencilsets/bpmn2.0/' // view里的svg路径
}

// 去掉路径里的后半截工程目录wfapp/modeler.html
function splitUrl(url) {
  let index = url.indexOf('wfapp/modeler.html')
  return index === -1 ? url : url.substr(0, index)
}

/* 属性面板文字提示功能 */
function showToolTip() {
  jQuery(function(){
    jQuery('.question-circle-icon').toolTip({tipEle: 'customTip'})
  })
}
