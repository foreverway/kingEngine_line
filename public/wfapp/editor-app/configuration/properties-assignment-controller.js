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

/*
 * Assignment
 */
var KisBpmAssignmentCtrl = ['$scope', '$modal', function ($scope, $modal) {

	// Config for the modal window
	var opts = {
		template: 'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
		scope: $scope,
		backdrop: 'static'
	};

	// Open the dialog
	$modal(opts);
}];

var KisBpmAssignmentPopupCtrl = ['$scope', '$modal', function ($scope, $modal) {

  // Put json representing assignment on scope
	if ($scope.property.value !== undefined && $scope.property.value !== null
		&& $scope.property.value.assignment !== undefined
		&& $scope.property.value.assignment !== null) {
		$scope.assignment = _.cloneDeep($scope.property.value.assignment); //这里要深拷贝，否则取消按钮不起作用
	} else {
		$scope.assignment = {"assignType": "assignee"};
	}

	if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0) {
		$scope.assignment.candidateUsers = [{value: ''}];
	}

	if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0) {
		$scope.assignment.candidateGroups = [{value: ''}];
	}

	$scope.save = function () {

		$scope.property.value = {};
		// handleAssignmentInput($scope);
		var assign = $scope.property.value.assignment ? _.cloneDeep($scope.property.value.assignment) : {};
		$scope.property.value.assignment = Object.assign({}, assign, $scope.assignment);

    //回填完成人信息
    setAssignInputContent($scope);

		$scope.updatePropertyInModel($scope.property);
		$scope.close();
	};

	// Close button handler
	$scope.close = function () {
		// handleAssignmentInput($scope);
		$scope.property.mode = 'read';
		$scope.$hide();
	};

	var handleAssignmentInput = function ($scope) {
		if ($scope.assignment.candidateUsers) {
			var emptyUsers = true;
			var toRemoveIndexes = [];
			for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
				if ($scope.assignment.candidateUsers[i].value != '') {
					emptyUsers = false;
				}
				else {
					toRemoveIndexes[toRemoveIndexes.length] = i;
				}
			}

			for (var i = 0; i < toRemoveIndexes.length; i++) {
				$scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1);
			}

			if (emptyUsers) {
				$scope.assignment.candidateUsers = undefined;
			}
		}

		if ($scope.assignment.candidateGroups) {
			var emptyGroups = true;
			var toRemoveIndexes = [];
			for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
				if ($scope.assignment.candidateGroups[i].value != '') {
					emptyGroups = false;
				}
				else {
					toRemoveIndexes[toRemoveIndexes.length] = i;
				}
			}

			for (var i = 0; i < toRemoveIndexes.length; i++) {
				$scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1);
			}

			if (emptyGroups) {
				$scope.assignment.candidateGroups = undefined;
			}
		}
	};

	/*自定义切换*/
	$scope.customChanged = function () {
		$scope.assignment.assignee = undefined;
		$scope.assignment.candidateUsers = [{value: ''}];
		$scope.assignment.candidateGroups = [{value: ''}];
		$scope.assignment.names = {};
	};

	// 打开弹窗
	$scope.openModal = function (userType) {
		$scope.userType = userType;// 用于区分用户类型
		$scope.tableConfig = KJDP[$scope.userType];
		if (userType === 'assignee') $scope.tableInitValue = $scope.assignment.assignee;
		else if (userType === 'candidateUser') {
			var temp = JSON.parse(JSON.stringify($scope.assignment.candidateUsers.filter(function (item) {
				return item instanceof Object && item.value !== ''
			}).map(function (item) {
				return item instanceof Object ? item.value : item
			})));
			$scope.tableInitValue = typeof(temp) === 'string' ? JSON.parse(temp) : temp;
		}
		else if (userType === 'candidateGroup') {
			var temp = JSON.parse(JSON.stringify($scope.assignment.candidateGroups.filter(function (item) {
				return item instanceof Object && item.value !== ''
			}).map(function (item) {
				return item instanceof Object ? item.value : item
			})));
			$scope.tableInitValue = typeof(temp) === 'string' ? JSON.parse(temp) : temp;
		}

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

	// 接收事件传递
	$scope.$on('tableEvent', function (e, selectedRowNames, selectedRowKeys) {
		if (!$scope.assignment.names) $scope.assignment.names = {};
		var temp = selectedRowKeys && typeof(selectedRowKeys) !== 'string' && selectedRowKeys.map(function (item) {
			return typeof(item) === 'string' ? {value: item} : item
		});

		if ($scope.userType === 'assignee') {
			$scope.assignment.assignee = selectedRowKeys;
			$scope.assignment.names.assignee = selectedRowNames;
		}
		else if ($scope.userType === 'candidateUser') {
			$scope.assignment.candidateUsers = temp;
			$scope.assignment.names.candidateUser = selectedRowNames;
		}
		else if ($scope.userType === 'candidateGroup') {
			$scope.assignment.candidateGroups = temp;
			$scope.assignment.names.candidateGroup = selectedRowNames;
		}
	});
}];

//设置完成人input框信息
function setAssignInputContent($scope) {
  var assign = $scope.assignment;
  if (assign) {
    $scope.property.value.inputContent = assign.names && assign.names[assign.assignType] ?  //是否自定义
      assign.names[assign.assignType] : assign[assign.assignType]?  //自定义时类型是否是指定人
        assign[assign.assignType] : assign[assign.assignType + 's'][0].value;
  }
}
