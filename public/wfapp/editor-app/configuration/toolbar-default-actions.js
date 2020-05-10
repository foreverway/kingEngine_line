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
KISBPM.TOOLBAR = {
    ACTIONS: {

        saveModel: function (services) {
            // 流程图设计不做处理
            /*var json = services.$scope.editor.getJSON();
            json = JSON.stringify(json);
            var msg = checkPropertyByType(json);
            services.$scope.msg = msg;
            if (msg.result === false)
                var modal = services.$modal({
                    backdrop: true,
                    keyboard: true,
                    template: 'editor-app/popups/save-tip.html?version=' + Date.now(),
                    scope: services.$scope
                });
            else*/
                var modal = services.$modal({
                    backdrop: true,
                    keyboard: true,
                    template: 'editor-app/popups/save-model.html?version=' + Date.now(),
                    scope: services.$scope
                });
        },

        undo: function (services) {

            // Get the last commands
            var lastCommands = services.$scope.undoStack.pop();

            if (lastCommands) {
                // Add the commands to the redo stack
                services.$scope.redoStack.push(lastCommands);

                // Force refresh of selection, might be that the undo command
                // impacts properties in the selected item
                if (services.$rootScope && services.$rootScope.forceSelectionRefresh)
                {
                	services.$rootScope.forceSelectionRefresh = true;
                }

                // Rollback every command
                for (var i = lastCommands.length - 1; i >= 0; --i) {
                    lastCommands[i].rollback();
                }

                // Update and refresh the canvas
                services.$scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_UNDO_ROLLBACK,
                    commands: lastCommands
                });

                // Update
                services.$scope.editor.getCanvas().update();
                services.$scope.editor.updateSelection();
            }

            var toggleUndo = false;
            if (services.$scope.undoStack.length == 0)
            {
            	toggleUndo = true;
            }

            var toggleRedo = false;
            if (services.$scope.redoStack.length > 0)
            {
            	toggleRedo = true;
            }

            if (toggleUndo || toggleRedo) {
                for (var i = 0; i < services.$scope.items.length; i++) {
                    var item = services.$scope.items[i];
                    if (toggleUndo && item.action === 'KISBPM.TOOLBAR.ACTIONS.undo') {
                        services.$scope.safeApply(function () {
                            item.enabled = false;
                        });
                    }
                    else if (toggleRedo && item.action === 'KISBPM.TOOLBAR.ACTIONS.redo') {
                        services.$scope.safeApply(function () {
                            item.enabled = true;
                        });
                    }
                }
            }
        },

        redo: function (services) {

            // Get the last commands from the redo stack
            var lastCommands = services.$scope.redoStack.pop();

            if (lastCommands) {
                // Add this commands to the undo stack
                services.$scope.undoStack.push(lastCommands);

                // Force refresh of selection, might be that the redo command
                // impacts properties in the selected item
                if (services.$rootScope && services.$rootScope.forceSelectionRefresh)
                {
                	services.$rootScope.forceSelectionRefresh = true;
                }

                // Execute those commands
                lastCommands.each(function (command) {
                    command.execute();
                });

                // Update and refresh the canvas
                services.$scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_UNDO_EXECUTE,
                    commands: lastCommands
                });

                // Update
                services.$scope.editor.getCanvas().update();
                services.$scope.editor.updateSelection();
            }

            var toggleUndo = false;
            if (services.$scope.undoStack.length > 0) {
                toggleUndo = true;
            }

            var toggleRedo = false;
            if (services.$scope.redoStack.length == 0) {
                toggleRedo = true;
            }

            if (toggleUndo || toggleRedo) {
                for (var i = 0; i < services.$scope.items.length; i++) {
                    var item = services.$scope.items[i];
                    if (toggleUndo && item.action === 'KISBPM.TOOLBAR.ACTIONS.undo') {
                        services.$scope.safeApply(function () {
                            item.enabled = true;
                        });
                    }
                    else if (toggleRedo && item.action === 'KISBPM.TOOLBAR.ACTIONS.redo') {
                        services.$scope.safeApply(function () {
                            item.enabled = false;
                        });
                    }
                }
            }
        },

        cut: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editCut();
            for (var i = 0; i < services.$scope.items.length; i++) {
                var item = services.$scope.items[i];
                if (item.action === 'KISBPM.TOOLBAR.ACTIONS.paste') {
                    services.$scope.safeApply(function () {
                        item.enabled = true;
                    });
                }
            }
        },

        copy: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editCopy();
            for (var i = 0; i < services.$scope.items.length; i++) {
                var item = services.$scope.items[i];
                if (item.action === 'KISBPM.TOOLBAR.ACTIONS.paste') {
                    services.$scope.safeApply(function () {
                        item.enabled = true;
                    });
                }
            }
        },

        paste: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editPaste();
        },

        deleteItem: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editDelete();
        },

        addBendPoint: function (services) {

            var dockerPlugin = KISBPM.TOOLBAR.ACTIONS._getOryxDockerPlugin(services.$scope);

            var enableAdd = !dockerPlugin.enabledAdd();
            dockerPlugin.setEnableAdd(enableAdd);
            if (enableAdd)
            {
            	dockerPlugin.setEnableRemove(false);
            	document.body.style.cursor = 'pointer';
            }
            else
            {
            	document.body.style.cursor = 'default';
            }
        },

        removeBendPoint: function (services) {

            var dockerPlugin = KISBPM.TOOLBAR.ACTIONS._getOryxDockerPlugin(services.$scope);

            var enableRemove = !dockerPlugin.enabledRemove();
            dockerPlugin.setEnableRemove(enableRemove);
            if (enableRemove)
            {
            	dockerPlugin.setEnableAdd(false);
            	document.body.style.cursor = 'pointer';
            }
            else
            {
            	document.body.style.cursor = 'default';
            }
        },

        /**
         * Helper method: fetches the Oryx Edit plugin from the provided scope,
         * if not on the scope, it is created and put on the scope for further use.
         *
         * It's important to reuse the same EditPlugin while the same scope is active,
         * as the clipboard is stored for the whole lifetime of the scope.
         */
        _getOryxEditPlugin: function ($scope) {
            if ($scope.oryxEditPlugin === undefined || $scope.oryxEditPlugin === null) {
                $scope.oryxEditPlugin = new ORYX.Plugins.Edit($scope.editor);
            }
            return $scope.oryxEditPlugin;
        },

        zoomIn: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoom([1.0 + ORYX.CONFIG.ZOOM_OFFSET]);
        },

        zoomOut: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoom([1.0 - ORYX.CONFIG.ZOOM_OFFSET]);
        },

        zoomActual: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).setAFixZoomLevel(1);
        },

        zoomFit: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoomFitToModel();
        },

        alignVertical: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_MIDDLE]);
        },

        alignHorizontal: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_CENTER]);
        },

        sameSize: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_SIZE]);
        },

        closeEditor: function(services) {

          //通知流程图模板列表刷新
          window.postMessage('updateProcessTemplate', window.location.origin);

          //通知流程方案配置列表刷新
          window.postMessage('updateProcessSolution', window.location.origin);

        	window.close()
        },

        /**
         * Helper method: fetches the Oryx View plugin from the provided scope,
         * if not on the scope, it is created and put on the scope for further use.
         */
        _getOryxViewPlugin: function ($scope) {
            if ($scope.oryxViewPlugin === undefined || $scope.oryxViewPlugin === null) {
                $scope.oryxViewPlugin = new ORYX.Plugins.View($scope.editor);
            }
            return $scope.oryxViewPlugin;
        },

        _getOryxArrangmentPlugin: function ($scope) {
            if ($scope.oryxArrangmentPlugin === undefined || $scope.oryxArrangmentPlugin === null) {
                $scope.oryxArrangmentPlugin = new ORYX.Plugins.Arrangement($scope.editor);
            }
            return $scope.oryxArrangmentPlugin;
        },

        _getOryxDockerPlugin: function ($scope) {
            if ($scope.oryxDockerPlugin === undefined || $scope.oryxDockerPlugin === null) {
                $scope.oryxDockerPlugin = new ORYX.Plugins.AddDocker($scope.editor);
            }
            return $scope.oryxDockerPlugin;
        }
    }
};

/** Custom controller for the save dialog */
var SaveModelCtrl = [ '$rootScope', '$scope', '$http', '$route', '$location',
    function ($rootScope, $scope, $http, $route, $location) {

    var modelMetaData = $scope.editor.getModelMetaData();

    var description = '';
    if (modelMetaData.description) {
    	description = modelMetaData.description;
    }

    var saveDialog = { 'name' : modelMetaData.name,
            'description' : description};

    $scope.saveDialog = saveDialog;

    var json = $scope.editor.getJSON();
    json = JSON.stringify(json);

    var params = {
        modeltype: modelMetaData.model.modelType,
        json_xml: json,
        name: 'model'
    };

    $scope.status = {
        loading: false
    };

    $scope.close = function () {
    	$scope.$hide();
    };

    $scope.saveAndClose = function () {

      //通知流程图模板列表刷新
      window.postMessage('updateProcessTemplate', window.location.origin);

    	$scope.save(function() {
    		window.close()
    	});
    };
    $scope.save = function (successCallback) {

        if (!$scope.saveDialog.name || $scope.saveDialog.name.length == 0) {
            return;
        }

        // Indicator spinner image
        $scope.status = {
        	loading: true
        };

        modelMetaData.name = $scope.saveDialog.name;
        modelMetaData.description = $scope.saveDialog.description;

        var json = $scope.editor.getJSON();

        //设置前置监听和后置监听
        setTaskListeners(json);

        //设置全局属性
        setGlobalAttributes(json);

        // console.log(json);

        json = JSON.stringify(json);

        var selection = $scope.editor.getSelection();
        $scope.editor.setSelection([]);

        // Get the serialized svg image source
        var svgClone = $scope.editor.getCanvas().getSVGRepresentation(true);
        $scope.editor.setSelection(selection);
        if ($scope.editor.getCanvas().properties["oryx-showstripableelements"] === false) {
            var stripOutArray = jQuery(svgClone).find(".stripable-element");
            for (var i = stripOutArray.length - 1; i >= 0; i--) {
            	stripOutArray[i].remove();
            }
        }

        // Remove all forced stripable elements
        var stripOutArray = jQuery(svgClone).find(".stripable-element-force");
        for (var i = stripOutArray.length - 1; i >= 0; i--) {
            stripOutArray[i].remove();
        }

        // Parse dom to string
        var svgDOM = DataManager.serialize(svgClone);

        var params = {
            json_xml: json,
            svg_xml: svgDOM,
            name: $scope.saveDialog.name,
            description: $scope.saveDialog.description
        };

        // Update
        $http({    method: 'PUT',
            data: params,
            ignoreErrors: true,
//            headers: {'Accept': 'application/json',
//                      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
//            transformRequest: function (obj) {
//                var str = [];
//                for (var p in obj) {
//                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//                }
//                return str.join("&");
//			},
			url: $rootScope.editType === "solution" ? KISBPM.URL.putSolution(modelMetaData.modelId) :
				KISBPM.URL.putModel(modelMetaData.modelId)
		})

            .success(function (data, status, headers, config) {
                $scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_SAVED
                });
                $scope.modelData.name = $scope.saveDialog.name;
                $scope.modelData.lastUpdated = data.lastUpdated;

                $scope.status.loading = false;
                $scope.$hide();

                // Fire event to all who is listening
                var saveEvent = {
                    type: KISBPM.eventBus.EVENT_TYPE_MODEL_SAVED,
                    model: params,
                    modelId: modelMetaData.modelId,
		            eventType: 'update-model'
                };
                KISBPM.eventBus.dispatch(KISBPM.eventBus.EVENT_TYPE_MODEL_SAVED, saveEvent);

                // Reset state
                $scope.error = undefined;
                $scope.status.loading = false;

                // Execute any callback
                if (successCallback) {
                    successCallback();
                }

                if (data.code == 200 || data.code == 201 || data.code == 202 || data.code == 204) {
                  toastr.success('保存成功');
                } else {
                  toastr.error('保存失败，服务器出错');
                }

            })
            .error(function (data, status, headers, config) {
                $scope.error = {};
                console.log('Something went wrong when updating the process model:' + JSON.stringify(data));
                $scope.status.loading = false;
                toastr.error('保存失败');
            });
    };

}];

var SaveSolutionCtrl = ['$scope', '$modal', function ($scope, $modal) {
	$scope.save = function () {
        var json = $scope.editor.getJSON();
        json = JSON.stringify(json);
        var msg = checkPropertyByType(json, $scope);
        $scope.msg = msg;
        if (msg.result === false)
            var opts = {
                scope: $scope,
                backdrop: 'static',
                template: 'editor-app/popups/save-tip.html?version=' + Date.now(),
            };
        else
        // Config for the modal window
            var opts = {
                scope: $scope,
                backdrop: 'static',
                template: 'editor-app/popups/save-solution.html?version=' + Date.now(),
            };

		// Open the dialog
		$modal(opts);
	};
}];

//设置前置监听和后置监听
function setTaskListeners(json) {
  json.childShapes && json.childShapes.forEach(function(node) {
    //判断是否有任务监听器属性
    if (node.properties.tasklisteners !== undefined) {
      //是否初始化
      if (!node.properties.tasklisteners.taskListeners) {
        node.properties.tasklisteners = {
          'taskListeners': []
        }
      }
      var task = node.properties.tasklisteners.taskListeners;

      var preListener = node.properties.prelistener;
      var hasPre = preListener && preListener.trim().length; //有前置监听器且有值
      var noPre = preListener !== undefined && preListener.trim().length === 0; //有前置监听器但没有值
      var preExp = '${' + preListener.trim() + '}';          //填写前置监听器表达式
      var preFlag = false;                                   //是否已经有前置监听器

      var postListener = node.properties.postlistener;
      var hasPost = postListener && postListener.trim().length; //有后置监听器且有值
      var noPost = postListener !== undefined && postListener.trim().length === 0; //有后置监听器但没有值
      var postExp = '${' + postListener.trim() + '}';          //填写后置监听器表达式
      var postFlag = false;                                   //是否已经有后置监听器

      var i = 0;
      var flag = false; //标记是否需要删除数组元素
      while(i < task.length) {
        var listener = task[i];
        //是否是超时监听器
        if(!listener.isTimeoutListener) {
          if (listener.event === 'create') {
            //已有前置监听器，修改代理表达式值
            if (hasPre) {
              listener.delegateExpression = preExp;
              preFlag = true;
            }
            //有前置监听器但没有值，需要删除原有监听器里的前置监听器
            if(noPre) {
              task.splice(i, 1);
              flag = true;
            } else {
              flag = false;
            }
          }

          if (listener.event === 'complete') {
            //已有后置监听器，修改代理表达式值
            if (hasPost) {
              listener.delegateExpression = postExp;
              postFlag = true;
            }
            //有后置监听器但没有值，需要删除原有监听器里的后置监听器
            if(noPost) {
              task.splice(i, 1);
              flag = true;
            } else {
              flag = false;
            }
          }
        }
        if (!flag) {
          i ++;
        }
      }

      //不存在原有前置监听器
      if (!preFlag && hasPre) {
        task.push({
          'event': 'create',
          'delegateExpression': preExp
        })
      }

      //不存在原有后置监听器
      if (!postFlag && hasPost) {
        task.push({
          'event': 'complete',
          'delegateExpression': postExp
        })
      }
    }
    return setTaskListeners(node);
  });
}

//设置全局属性
function setGlobalAttributes(json) {
  if (!json.properties) {
    json.properties = {};
  }
  json.properties.dataproperties = {'items':[]};  //清空上次保存的数据
  Object.keys(json.properties).forEach(function(key) {
    if (key.indexOf('global_') !== -1) {
      var item = addGlobalAttribute(key, json.properties[key]);
      if(item) {
        json.properties.dataproperties.items.push(item);
      }
    }
  });
}

//增加全局配置属性
function addGlobalAttribute(key, value) {
  var boolFlag = ['global_add_index', 'global_finish_task'].includes(key);  //判断是否是boolean类型
  if ((boolFlag && value === true) || (!boolFlag && value.length)) {
    var item = {"dataproperty_type":"string"};
    item.dataproperty_id = processGlobalAttr[key];
    item.dataproperty_name = processGlobalAttr[key];
    item.dataproperty_value = value;
  }
  return item;
}
