/*
 * Table controller
 */
var KisBpmTablePropertyCtrl = ['$rootScope', '$scope', '$http', '$modal', function ($rootScope, $scope, $http, $modal) {
	// 打开弹窗
	$scope.openModal = function () {
		// Config for the modal window
		var opts = {
			template: 'editor-app/configuration/properties/table-property-popup-template.html?version=' + Date.now(),
			scope: $scope,
			backdrop: 'static',
			keyboard: false
		};

		// Open the dialog
		$modal(opts);
	};

	/*获取table列表数据*/
	function fetchTableList(method, url) {
		$http({method: method, url: url}).success(function (data, status, headers, config) {
			$scope.dataSource = data.resultData;
			// 选中的行
			var selectedRow = $scope.dataSource.filter(function (item) {
				if (!$scope.tableConfig.type || $scope.tableConfig.type === "radio") return $scope.property.value === item[$scope.tableConfig.rowKey];
				return $scope.property.value.findIndex(function (childItem) {
					return item[$scope.tableConfig.rowKey] === childItem;
				}) !== -1;
			});

			// 选中行对应的名称
			var selectedRowNames = selectedRow.map(function (item) {
				return item[$scope.tableConfig.rowName];
			}).join(',');

			$scope.property.selectedRowNames = selectedRowNames;
		}).error(function (data, status, headers, config) {
			console.log('Error loading Table List' + ' ' + data);
		});
	}

	// table配置信息
	$scope.tableConfig = KJDP.formkeydefinition;
	var value = $scope.property.value;
	if (typeof(value) === 'string' && value === '' || Array.isArray(value) && value.length === 0) ;
	else if ($scope.tableConfig) fetchTableList($scope.tableConfig.method || "POST", ACTIVITI.CONFIG.contextRoot + $scope.tableConfig.url);// 请求列表数据

	// 接受事件传递
	$scope.$on('tableEvent', function (e, selectedRowNames) {
		$scope.property.selectedRowNames = selectedRowNames;
		if ($scope.property.valid.required && !selectedRowNames) {
			$scope.valid = $scope.property.valid.required.errInfo;
		} else {
			$scope.valid = '';
		}
	});
}];

var KisBpmTablePropertyPopupCtrl = ['$scope', '$http', function ($scope, $http) {
	// var temp = $scope.$parent.$parent;// 可以获取到KisBpmTablePropertyCtrl，但是需要设置scope: $scope，否则$scope.property都无法获取

	// Close button handler
	$scope.close = function () {
		$scope.$hide();
	};

	$scope.cancel = function () {
		$scope.$hide();
	};

	// Click handler for save button
	if ($scope.tableConfig && $scope.tableConfig.save)
	// 重写保存方法，，用于完成人
		$scope.save = function () {
			$scope.tableConfig.save($scope);
		};
	else
		$scope.save = function () {
			if (!$scope.tableListDataCopy) {
				$scope.close();
				return;
			}

			$scope.property.value = $scope.selectedRowKeys;
			if ($scope.property.value && !Array.isArray($scope.property.value)) {
				$scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig, "");
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
			$scope.$emit('tableEvent', selectedRowNames);

			$scope.updatePropertyInModel($scope.property);
			$scope.close();
		};

	/*将分页存储在数组，用于ng-repeat*/
	$scope.getArray = function () {
		var i;
		var j;
		var arr = [];
		var pageNum = Math.ceil($scope.total / $scope.pageSize);// 总页数
		$scope.leftEllipsis = false;
		$scope.rightEllipsis = false;

		if (pageNum <= 2) {
			return arr;
		} else if (pageNum <= $scope.pageShowSize + 1) {
			i = 2;
			j = pageNum - 1;
		} else if ($scope.curPage >= 1 && $scope.curPage < $scope.pageShowSize) {
			i = 2;
			j = $scope.pageShowSize;
			$scope.rightEllipsis = true;
		} else if ($scope.curPage >= $scope.pageShowSize && $scope.curPage <= pageNum - $scope.pageShowSize + 1) {
			i = $scope.curPage - 1;
			j = $scope.curPage + 1;
			$scope.leftEllipsis = true;
			$scope.rightEllipsis = true;
		} else if ($scope.curPage > pageNum - $scope.pageShowSize + 1 && $scope.curPage <= pageNum) {
			i = pageNum - $scope.pageShowSize + 1;
			j = pageNum - 1;
			$scope.leftEllipsis = true;
		} else return arr;

		// console.log(i, j);
		for (; i <= j; i++) arr.push(i);
		return arr;
	};

	/*改变页码*/
	$scope.pageChanged = function (newPage) {
		$scope.curPage = newPage;
		computeData();
		setSelectAll();
		// console.log(newPage, $scope.pageSize);
	};

	/*改变每页条数*/
	$scope.pageSizeOptionsChanged = function () {
		$scope.curPage = 1;
		computeData();
		setSelectAll();
		// console.log($scope.curPage, $scope.pageSize);
	};

	/*selectedRowKeys改变*/
	$scope.selectedRowKeysClick = function (selectedRowKey) {
		if ($scope.type === "radio") {
			$scope.selectedRowKeys = $scope.selectedRowKeys == selectedRowKey ? '' : selectedRowKey;
			return;
		}

		// 修改选中的值
		var index = $scope.selectedRowKeys.indexOf(selectedRowKey);
		if (index > -1) {
			// is currently selected
			$scope.selectedRowKeys.splice(index, 1);
		} else {
			// is newly selected
			$scope.selectedRowKeys.push(selectedRowKey);
		}

		setSelectAll();
	};

	/*点击tr行*/
	$scope.trClick = function (selectedRowKey) {
		if ($scope.type === "radio") {
			$scope.selectedRowKeys = $scope.selectedRowKeys == selectedRowKey ? '' : selectedRowKey;
		}
		else $scope.selectedRowKeysClick(selectedRowKey);
	};

	/*checkbox点击全选/全不选*/
	$scope.selectAllRowClick = function () {
		if ($scope.type === "radio") return;

		if ($scope.selectAllRow) {
			$scope.dataSource.forEach(function (item) {
				if (!$scope.selectedRowKeys.includes(item[$scope.rowKey]))
					$scope.selectedRowKeys.push(item[$scope.rowKey]);
			})
		} else {
			$scope.dataSource.forEach(function (item) {
				var index = $scope.selectedRowKeys.indexOf(item[$scope.rowKey]);
				if (index > -1) $scope.selectedRowKeys.splice(index, 1);
			})
		}
	};

	/*设置全选*/
	function setSelectAll() {
		if ($scope.type === "checkbox" && $scope.dataSource && $scope.dataSource.length > 0
			&& $scope.selectedRowKeys && $scope.selectedRowKeys.length > 0)
			$scope.selectAllRow = !!includes($scope.selectedRowKeys, $scope.dataSource);
	}

	/*数组是否包含另一个数组的元素*/
	function includes(arr1, arr2) {
		return arr2.every(function (val) {
			return arr1.includes(val[$scope.rowKey]);
		});
	}

	/*计算表格数据*/
	function computeData() {
		// 计算列表、分页相关数据
		$scope.total = $scope.tableListData.length;
		$scope.dataSource = $scope.tableListData.slice(($scope.curPage - 1) * $scope.pageSize, $scope.curPage * $scope.pageSize);
		// console.log($scope.dataSource, $scope.tableListData);
	}

	/*获取table列表数据*/
	function fetchTableList(method, url) {
		// var url = ACTIVITI.CONFIG.contextRoot + $scope.url;

		$http({method: method, url: url}).success(function (data, status, headers, config) {
			$scope.tableListData = data.resultData;
			// $scope.tableListDataCopy = angular.fromJson(angular.toJson(data.resultData));
			var temp = JSON.parse(JSON.stringify($scope.tableListData));
			$scope.tableListDataCopy = typeof(temp) === 'string' ? JSON.parse(temp) : temp;
			computeData();
		}).error(function (data, status, headers, config) {
			console.log('Error loading Table List' + ' ' + data);
			$scope.fetchError = 'Error loading Table List';
		});
	}

	/*搜索*/
	$scope.searchTable = function () {
		// console.log($scope.searchText);
		if ($scope.searchText)
			$scope.tableListData = $scope.tableListDataCopy.filter(function (item) {
				return $scope.searchColumn.some(function (searchColumn) {
					return item[searchColumn].toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1;
				})
			});
		else {
			var temp = JSON.parse(JSON.stringify($scope.tableListDataCopy));
			$scope.tableListData = typeof(temp) === 'string' ? JSON.parse(temp) : temp;
		}

		$scope.curPage = 1;
		computeData();
	};

	/*按enter搜索*/
	$scope.enterPressed = function (keyEvent) {
		if (keyEvent && keyEvent.which === 13) {
			keyEvent.preventDefault();
			$scope.searchTable();
		}
	};

	/*排序*/
	$scope.sortClick = function (column) {
		// console.log(column);
		// 看是不是相同列名，再看顺序
		if ($scope.sort.dataIndex === column.dataIndex) $scope.sort.order = $scope.sortDirection[$scope.sort.order];
		else $scope.sort = {dataIndex: column.dataIndex, order: 'asc'};
		// console.log($scope.sort);

		var temp = JSON.parse(JSON.stringify($scope.tableListDataCopy));
		$scope.tableListData = typeof(temp) === 'string' ? JSON.parse(temp) : temp;
		if ($scope.sort.order && $scope.sort.order !== '')
			$scope.tableListData.sort(function (s1, s2) {
				if ($scope.sort.order === 'asc')
					return PinYinUtil.getFirstLetter(s1[$scope.sort.dataIndex].toString()).localeCompare(PinYinUtil.getFirstLetter(s2[$scope.sort.dataIndex].toString()), 'en');
				if ($scope.sort.order === 'desc')
					return PinYinUtil.getFirstLetter(s2[$scope.sort.dataIndex].toString()).localeCompare(PinYinUtil.getFirstLetter(s1[$scope.sort.dataIndex].toString()), 'en');
				return 0;
			});

		computeData();
	};

	$scope.Math = window.Math;// 在html中使用Math函数

	$scope.total = 0;// 总条数
	$scope.curPage = 1;// 当前页数
	$scope.pageSize = "5";// 每页条数
	$scope.pageSizeOptions = ["5", "10", "20", "30", "40"];// 分页选项
	$scope.leftEllipsis = false;// 是否显示左边省略号
	$scope.rightEllipsis = false;// 是否显示右边省略号
	$scope.pageShowSize = 4;// 分页很多的时，显示的总分页数-1，取值>=4
	$scope.searchText = "";// 搜索文本
	$scope.sortDirection = {'asc': 'desc', 'desc': '', '': 'asc'};// 排序方向

	var temp = $scope.tableConfig;
	if (temp) {
		$scope.title = temp.title;
		$scope.rowKey = temp.rowKey;
		$scope.rowName = temp.rowName;
		$scope.url = temp.url;
		$scope.method = temp.method || "POST";
		$scope.type = temp.type || "radio";
		$scope.searchColumn = temp.searchColumn || [];
		$scope.columns = temp.columns;
		$scope.selectAllRow = false;// 全选
		$scope.selectedRowKeys = $scope.type === "radio" ? null : [];// 选中数据
		$scope.fetchError = null;
		$scope.sort = {};// 排序信息
		if ($scope.tableInitValue) $scope.selectedRowKeys = $scope.tableInitValue;// 初始化选中数据，用于完成人
		else if ($scope.property.value) $scope.selectedRowKeys = $scope.property.value;// 初始化选中数据
		if ($scope.url) fetchTableList($scope.method, ACTIVITI.CONFIG.contextRoot + $scope.url);// 请求列表数据
	}

	// 监听变量变化，$watch性能低，在ng-if下不起作用
	// $scope.$watch('{pageSize:pageSize,selectedRowKeys:selectedRowKeys}', function (newValue, oldValue) {
	// 	if (newValue === oldValue) return;
	// 	console.log(newValue, oldValue);
	// }, true);

	// 使用jqlite
	// var $element = angular.element(document.querySelector("#main"));
	// 使用jquery
	// var $element = angular.element("#main");

	// AngularJS 中 Controller 之间的通信，参考：https://github.com/huangtengfei/blog/issues/8 https://blog.csdn.net/yesicatt/article/details/73127628
}];

/*自定义过滤器（向上取整）*/
angular.module('activitiModeler').filter('ceil', function () {
	return function (text) {
		return Math.ceil(text);
	}
});
