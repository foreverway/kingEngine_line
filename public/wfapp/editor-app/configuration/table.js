'use strict';

var KJDP = {};
/*表单标识key*/
KJDP.formkeydefinition = {
	title: "选择表单",
	rowKey: "formId",// id索引
	rowName: "formName",// table弹窗选择后，表单显示rowName对应的值而不是rowKey对应的值
	url: "/form/publishedFormList",// 请求列表数据url
	method: 'POST',// 请求方法
	// type: "checkbox",// 多选/单选，checkbox or radio
	searchColumn: ['formName', 'formKey'],// 搜索字段
	columns: [
		{
			title: '表单名称',
			dataIndex: 'formName'
		},
		{
			title: '表单标识',
			dataIndex: 'formKey'
		},
		{
			title: '表单类型',
			dataIndex: 'formType',
			render: function (text) {
				if (text === 1) return '<span class="label label-info">URL表单</span>';
				else if (text === 0) return '<span class="label label-success">系统表单</span>';
				else return text;
			}
		},
		{
			title: '版本',
			dataIndex: 'version'
		},
		{
			title: '发布时间',
			dataIndex: 'deployedTime',
			render: function (text) {
				if (text) return '<span class="glyphicon glyphicon-time table-clock"></span> ' + text;
				return text;
			}
		}
	]
};

/*用户单选*/
KJDP.assignee = {
	title: "选择用户",
	rowKey: "userId",// id索引
	rowName: "userName",// table弹窗选择后，表单显示rowName对应的值而不是rowKey对应的值
	url: "/user/userList",// 请求列表数据url
	method: 'GET',// 请求方法
	// type: "checkbox",// 多选/单选，checkbox or radio
	searchColumn: ['userId', 'userName'],// 搜索字段
	columns: [
		{
			title: '姓名',
			dataIndex: 'userName'
		},
		{
			title: '员工编号',
			dataIndex: 'userId'
		}
	],
	save: function ($scope) {
		if (!$scope.tableListDataCopy) {
			$scope.close();
			return;
		}

		// 选中的行
		var selectedRow = $scope.tableListDataCopy.filter(function (item) {
			if ($scope.type === "radio") return $scope.selectedRowKeys === item[$scope.rowKey];
			return $scope.selectedRowKeys.findIndex(function (childItem) {
				return item[$scope.rowKey] === childItem;
			}) !== -1;
		});

		// 选中行对应的名称
		var selectedRowNames = selectedRow.map(function (item) {
			return item[$scope.rowName];
		}).join(',');

		// 使用事件传递
		$scope.$emit('tableEvent', selectedRowNames, $scope.selectedRowKeys);

		$scope.close();
	}
};

/*用户多选*/
KJDP.candidateUser = Object.assign({}, KJDP.assignee, {type: "checkbox"});

/*角色多选*/
KJDP.candidateGroup = {
	title: "选择角色",
	rowKey: "roleId",// id索引
	rowName: "roleName",// table弹窗选择后，表单显示rowName对应的值而不是rowKey对应的值
	url: "/user/roleList",// 请求列表数据url
	method: 'GET',// 请求方法
	type: "checkbox",// 多选/单选，checkbox or radio
	searchColumn: ['roleId', 'roleName'],// 搜索字段
	columns: [
		{
			title: '角色名称',
			dataIndex: 'roleName'
		},
		{
			title: '角色编号',
			dataIndex: 'roleId'
		}
	],
	save: KJDP.assignee.save
};