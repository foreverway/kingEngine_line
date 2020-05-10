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
'use strict';

var KISBPM = KISBPM || {};

KISBPM.CONFIG = {
		'showRemovedProperties' : false
};

KISBPM.HEADER_CONFIG = {
		'showAppTitle' : true,
		'showHeaderMenu' : true,
		'showMainNavigation' : true,
		'showPageHeader' : true
};

//流程图节点属性分组，在stencliset.json里用group属性为1表示基础属性，没有该属性则归类到扩展属性）
KISBPM.PROPERTY_GROUP = [
	 {
		'id': 1,
	 	'type': "基础属性",  //分组名
		'number': 0,        //分组下的属性个数
		'visible': true     //默认是否展开该分组
	},
  {
    'id': 2,
    'type': "其他设置",
    'number': 0,
    'visible': true
  },
  {
    'id': 3,
    'type': "全局属性",
    'number': 0,
    'visible': true
  },
	{
		'id': 0,
		'type': "扩展属性",
		'number': 0,
		'visible': true
	}
];

//消息提示框初始化
toastr.options = {
    closeButton: true,  //是否显示关闭按钮
    rtl: false,         //关闭按钮和消息提示文字的位置
    positionClass: 'toast-top-center',   //消息提示框位置
    hideDuration: 500,  //点击关闭按钮消失时间
    timeOut: 3000,   //消息提示框显示时间
};

//超时处理字段值配置
var timeoutConfig = {
  'event': 'create',
  'className': 'com.szkingdom.workflow.listener.UserTaskListener',
  'fieldsName': 'taskOverdueStrategy',
  'delayTimeFieldsName': 'delayDueDateExpression',
  'fieldsCallInterfaceName': 'callInterfaceExpression',
  'delayTimeExpression': '.getDelayMillis(task)}'
};

//流程全局属性
var processGlobalAttr = {
  'global_form': 'defaultFormId',  //全局默认表单
  'global_finish_task': 'completeFirstUserTask',  //完成首个用户任务
  'global_add_index': 'insertBizIndexData',  //添加业务索引数据
  'global_custom_key': 'bizIndexDataKeys',  //自定义key
  'global_start_callback': 'bizProcessStartCallback',  //业务流程启动回调接口
  'global_run_callback': 'bizNodeRunDefaultCallback',  //业务流程运行时回调接口
  'global_end_callback': 'bizProcessEndCallback'  //业务流程结束回调接口
};
