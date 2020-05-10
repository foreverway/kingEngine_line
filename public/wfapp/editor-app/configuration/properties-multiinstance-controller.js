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
 * Execution listeners
 */

var KisBpmMultiInstanceCtrl = [ '$scope', function($scope) {

  //把选中节点的所有属性从数组转化为对象（浅拷贝）
  setSelectedItemPros($scope);

  //设初始值
  if ($scope.property.value == undefined && $scope.property.value == null || !$scope.property.value.length) {
    $scope.property.value = $scope.propertyPackages[$scope.property.key].value;
  }

  // 清空需要隐藏的属性输入值和校验属性
  clearOtherProperties($scope.property, $scope);

  // 计算哪些属性需要隐藏
  hideOtherProperties($scope.selectedItem.properties,  $scope.property);

  $scope.multiInstanceChanged = function() {

    var properties = $scope.selectedItem.properties;
    var curProperty = $scope.property;

    // 初始化该下拉列表影响的所有属性的show和校验属性
    initOtherProperties (curProperty, $scope);

    // 清空需要隐藏的属性输入值和校验属性
    clearOtherProperties(curProperty, $scope);

    // 计算哪些属性需要隐藏
    hideOtherProperties(properties, curProperty);

    $scope.updatePropertyInModel($scope.property);
  };
}];

/*选择下拉列表动态显示隐藏其他属性功能*/
function hideOtherProperties (properties, curProperty) {
  var k = 0;
  while (curProperty.hideProperties && k < properties.length) {
    var hideProperties = curProperty.hideProperties;
    if (hideProperties[curProperty.value]
      && hideProperties[curProperty.value].includes(properties[k].key.slice(5))) {
      properties[k].show = false;
    }
    k++;
  }
}

/* 在隐藏属性之前需要先初始化该下拉列表影响的所有属性的show和校验属性 */
function initOtherProperties (curProperty, $scope) {
  var properties = $scope.selectedItem.properties;
  var allHidePro = {};  //用该对象的key存放影响的所有属性的并集
  var hidePros = curProperty.hideProperties;
  hidePros && Object.keys(hidePros).forEach(function (key) {
    hidePros[key].forEach(function(hidePro) {
      allHidePro[hidePro] = true;
    });
  });

  var pack = $scope.jsonData.propertyPackages;
  var packforValid = $scope.jsonDataforValid.propertyPackages;
  properties.forEach(function(item) {
    if (allHidePro[item.key.slice(5)]) {
      item.show = true;  //初始化所有受影响的属性的show
      for (var n = 0; n < pack.length; n++) {
        if (item.key.indexOf(pack[n].properties[0].id) !== -1) {
          item.valid = pack[n].properties[0].valid;  //初始化所有受影响属性的校验属性
          packforValid[n].properties[0].valid = item.valid;
          break;
        }
      }
    }
  });
}

/* 切换下拉列表选项时，清空需要隐藏的属性输入值和校验属性 */
function clearOtherProperties (curProperty, $scope) {
  var properties = $scope.selectedItem.properties;
  var packforValid = $scope.jsonDataforValid.propertyPackages;

  curProperty.hideProperties && curProperty.hideProperties[curProperty.value]
  && curProperty.hideProperties[curProperty.value]
    .forEach(function(hidePro) {

      //清空隐藏的属性输入值
      for (var i = 0; i < properties.length; i++) {
        if (properties[i].key.indexOf(hidePro) !== -1) {
          properties[i].value = '';
          $scope.updatePropertyInModel(properties[i]);  //更新数据
          break;
        }
      }

      //清空校验属性
      for (var n = 0; n < packforValid.length; n++) {
        if (hidePro == packforValid[n].properties[0].id) {
          packforValid[n].properties[0].valid = {};
          break;
        }
      }
    });
}

