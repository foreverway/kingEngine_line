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
 * String controller
 */

var KisBpmStringPropertyCtrl = [ '$scope', function ($scope) {

	$scope.shapeId = $scope.selectedShape.id;
	$scope.valueFlushed = false;


	//disable全局id、name
	var canvasSelected = $scope.selectedItem.canvasSelected;
	if (canvasSelected && ($scope.property.key === "oryx-process_id" || $scope.property.key === "oryx-name"))
		$scope.property.disabled = true;

    /** Handler called when input field is blurred */
    $scope.inputBlurred = function() {

        //显示校验信息
        $scope.valid = validateSingleAttr($scope.property.value, $scope.property.valid);

        $scope.valueFlushed = true;
        if ($scope.property.value) {
            $scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig,"");
        }
        $scope.updatePropertyInModel($scope.property);

    };

    $scope.enterPressed = function(keyEvent) {
    	if (keyEvent && keyEvent.which === 13) {
    		keyEvent.preventDefault();
	        $scope.inputBlurred(); // we want to do the same as if the user would blur the input field
    	}
    };
    
    $scope.$on('$destroy', function controllerDestroyed() {
    	if(!$scope.valueFlushed) {
    		if ($scope.property.value) {
        		$scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig,"");
        	}
    		$scope.updatePropertyInModel($scope.property, $scope.shapeId);
    	}
    });

}];

/*
 * Boolean controller
 */

var KisBpmBooleanPropertyCtrl = ['$scope', function ($scope) {

  //把选中节点的所有属性从数组转化为对象（浅拷贝）
  $scope.selectedItemPros = {};
  $scope.selectedItem.properties.forEach(function(pro) {
    $scope.selectedItemPros[pro.key] = pro;
  });

  //默认条线从checkbox改成下拉列表，处理初始值
  if ($scope.property.key == 'oryx-defaultflow') {
    if (($scope.property.value == undefined && $scope.property.value == null) || $scope.property.value.toString() == 'false') {
      $scope.property.selectValue = 'standard';
      $scope.property.value = false;
    }
    if ($scope.property.value.toString() == 'true') {
      $scope.property.selectValue = 'default';
      $scope.property.value = true;
    }
  }

  //超时处理初始化
  timeoutHandle($scope);

  $scope.changeValue = function() {
    //处理默认跳线
    if ($scope.property.key == 'oryx-defaultflow') {
      $scope.property.value = $scope.property.selectValue != 'standard';
      if ($scope.property.value) {
        var selectedShape = $scope.selectedShape;
        if (selectedShape) {
          var incomingNodes = selectedShape.getIncomingShapes();
          if (incomingNodes && incomingNodes.length > 0) {
            // get first node, since there can be only one for a sequence flow
            var rootNode = incomingNodes[0];
            var flows = rootNode.getOutgoingShapes();
            if (flows && flows.length > 1) {
              // in case there are more flows, check if another flow is already defined as default
              for (var i = 0; i < flows.length; i++) {
                if (flows[i].resourceId != selectedShape.resourceId) {
                  var defaultFlowProp = flows[i].properties['oryx-defaultflow'];
                  if (defaultFlowProp) {
                    flows[i].setProperty('oryx-defaultflow', false, true);
                  }
                }
              }
            }
          }
        }
      }
    }

    //超时处理
    timeoutHandle($scope);

    $scope.updatePropertyInModel($scope.property);
  };
}];

/*
 * Text controller
 */

var KisBpmTextPropertyCtrl = [ '$scope', '$modal', function($scope, $modal) {

    var opts = {
        template:  'editor-app/configuration/properties/text-popup.html?version=' + Date.now(),
        scope: $scope,
        backdrop: 'static'
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmTextPropertyPopupCtrl = ['$scope', function($scope) {
    
    $scope.save = function() {
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.close = function() {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}];

/* 超时处理*/
function timeoutHandle($scope) {
  // 控制设置超时按钮的显示与隐藏，选中超时处理时显示超时按钮；
  if ($scope.property.key === 'oryx-timeout') {
    var timeHandler = $scope.selectedItemPros['oryx-timeouthandler'];
    timeHandler.show = !!$scope.property.value;
    $scope.updatePropertyInModel(timeHandler);
  }

  if(!$scope.property.value) {
    //未选中时清空到期的日期
    var curPros = $scope.selectedItemPros;
    var curDate = curPros['oryx-duedatedefinition'];  //当前节点的到期的日期
    if (curDate) {
      curDate.value = '';
      $scope.updatePropertyInModel(curDate);
    }

    //未选中时清空超时监听器，如果没有任何监听器，则清空value
    var curTasklistener = curPros['oryx-tasklisteners'];  //当前节点的任务监听器
    if (curTasklistener) {
      var curValue = curTasklistener.value;
      if (curValue && curValue.taskListeners) {
        var listeners = curValue.taskListeners;
        for (var i = 0; i < listeners.length; i ++) {
          if (listeners[i].isTimeoutListener) {
            listeners.splice(i, 1);
          }
        }
        //如果没有任何监听器，则清空value
        if (!listeners.length) {
          curTasklistener.value = '';
        }
      }
      $scope.updatePropertyInModel(curTasklistener);
    }

    //设置超时节点value的默认信息，以便设置超时的默认回填信息
    var curTimeHandler = curPros['oryx-timeouthandler'];
    if (curTimeHandler) {
      curTimeHandler.value = {
        'type': 'ignore',
        'inputContent': '不处理'
      };
      $scope.updatePropertyInModel(curTimeHandler);
    }
  }
}
