/*校验所有属性*/
function checkPropertyByType(elements, $scope) {
    elements = typeof (elements) === 'string' ? JSON.parse(elements) : elements;
    elements = elements.childShapes;

    var msg = {}, result = null;
    msg.result = true;

    var check = function (obj, res) {
        if (typeof res === 'object') {
            obj.result = res.result;
            obj.info = res.msg;
        } else {
            obj.result = res;
        }
        return obj;
    };

    for (var i = 0; i < elements.length; i++) {
        var nodeObj = elements[i];
        var stencilId = nodeObj.stencil.id, tag = false;
        switch (stencilId) {
            case "ServiceTask":
                result = checkServiceTask(nodeObj, $scope);
                msg = check(msg, result);
                if (nodeObj.properties.name === "")
                    msg.info = "请检查服务任务的属性，" + msg.info;
                else
                    msg.info = "请检查服务任务（" + nodeObj.properties.name + "）的属性，" + msg.info;
                if (!msg.result) tag = true;
                break;
            case "UserTask":
                result = checkUserTask(nodeObj, $scope);
                msg = check(msg, result);
                if (nodeObj.properties.name === "")
                    msg.info = "请检查用户任务的属性，" + msg.info;
                else
                    msg.info = "请检查用户任务（" + nodeObj.properties.name + "）的属性，" + msg.info;
                if (!msg.result) tag = true;
                break;
            case "SubProcess": 	//递归检查子流程里面的对象
                if (nodeObj.childShapes && nodeObj.childShapes.length > 0) {
                    topShapes = elements;
                    msg = checkPropertyByType(nodeObj, $scope);
                    if (!msg.result) tag = true;
                }
                break;
        }
        if (tag) break;
    }
    return msg;
}

//检查用户任务节点对象属性
function checkUserTask(nodeObj, $scope) {
    var propertyData = nodeObj.properties, result = true;

    var obj = getRequiredProperties(nodeObj, $scope);
    result = checkAndKeyValueByObject(propertyData, obj, $scope);

    if (typeof result !== 'object') {
        obj = getRegProperties(nodeObj, $scope);
        return checkAndRegExpByObject(propertyData, obj, $scope);
    }
    return result;
}

//检查服务任务节点对象属性
function checkServiceTask(nodeObj, $scope) {
    var propertyData = nodeObj.properties, result = true;

    var obj = getRequiredProperties(nodeObj, $scope);
    result = checkAndKeyValueByObject(propertyData, obj, $scope);

    if (typeof result !== 'object') {
        obj = getRegProperties(nodeObj, $scope);
        result= checkAndRegExpByObject(propertyData, obj, $scope);
    }

    if (typeof result !== 'object') {
        // 检查类名、表达式、代理的表达式是否填写
        return checkExpressionType(propertyData, $scope);
    }
    return result;
}

//根据传来的key检查value不能为空
function checkAndKeyValueByObject(propertyData, obj) {
    var result = true, info = {};
    for (var i = 0; i < obj.length; i++) {
        var item = obj[i];
        var key = item.properties[0].id;
        var title = item.properties[0].title;
        var tip = item.properties[0].valid.required.errInfo || "不能为空！";
        if (propertyData[key] && propertyData[key] !== "") {
            result = true;
        } else {
            info.result = false;
            info.msg = title + tip;
            result = info;
            break;
        }
    }
    return result;
}

//根据传来的key检查value匹配正则表达式
function checkAndRegExpByObject(propertyData, obj) {
    var result = true, info = {};
    for (var i = 0; i < obj.length; i++) {
        var item = obj[i];
        var key = item.properties[0].id;
        var title = item.properties[0].title;
        var exp = item.properties[0].valid.reg.exp;
        var tip = item.properties[0].valid.reg.errInfo || "正则不匹配！";
        if (exp && exp !== "") {
            var re = new RegExp(exp);
            if (re.test(propertyData[key])) {
                result = true;
                continue;
            }
        }
        info.result = false;
        info.msg = title + tip;
        result = info;
        break;
    }
    return result;
}

// 检查类名、表达式、代理的表达式是否填写
function checkExpressionType(propertyData, $scope) {
  var pros = $scope.jsonDataforValid.propertyPackages;
  for (var i = 0; i < pros.length; i++) {
    if (pros[i].properties[0].id == 'expressiontype') {
      var selectOptions = pros[i].properties[0].selectOptions;
      for (var j = 0; j < selectOptions.length; j++) {
        if (selectOptions[j].key === propertyData.expressiontype) {
          return propertyData[propertyData.expressiontype] ?
            true : {msg: selectOptions[j].value + '不能为空', result: false};
        }
      }

    }
  }
}

//获取带required的属性
function getRequiredProperties(nodeObj, $scope) {

    /* 过滤掉不是该类型任务的属性，避免诸如以下操作产生的问题：
    * 在流程图设计时选中属于用户任务的节点，然后在该节点的设置里更改成了服务任务，在nodeObj会合并用户任务和服务任务的属性
    * 需要再加一层过滤，过滤掉这些属性里不属于服务任务的属性，否则校验时会把用户任务的属性一起校验
    */
    //过滤掉不属于该类任务的属性
    var stencilsPackages = $scope.jsonDataforValid.stencils.filter(function(item) {
        return item.id == nodeObj.stencil.id;
    })[0].propertyPackages;

    //找出该类任务的属性的name和id的对应关系
    var filteProPackages = [];
    for (var i = 0; i < stencilsPackages.length; i++) {
        var item = stencilsPackages[i];
        for (var j = 0; i < $scope.jsonDataforValid.propertyPackages.length; j++) {
         var pro = $scope.jsonDataforValid.propertyPackages[j];
           if (pro.name == item) {
               filteProPackages.push(pro);
               break;
           }
        }
    }

    return filteProPackages.filter(function (item) {
        return nodeObj.properties[item.properties[0].id] !== undefined
    }).filter(function (item) {
        var pro = item.properties[0];
        // 过滤掉类名、表达式、代理的表达式
        var valid = ["servicetaskclass", "servicetaskexpression", "servicetaskdelegateexpression"]
          .includes(pro.id) ? {} : pro.valid;
        return valid && valid.required;
    });
}

//获取带reg的属性
function getRegProperties(nodeObj, $scope) {
    return $scope.jsonDataforValid.propertyPackages.filter(function (item) {
        return nodeObj.properties[item.properties[0].id] !== undefined
    }).filter(function (item) {
        var valid = item.properties[0].valid;
        return valid && valid.reg;
    });
}

//属性面板单个属性校验
function validateSingleAttr(value, valid) {
    var len = value.length;
    if (!valid) {
      return '';
    }
    if(!len) {
        if (valid.required) {
            return valid.required.errInfo || "不能为空";
        }
    }
    if (valid.reg) {
        if(!new RegExp(valid.reg.exp).test(value)) {
            return valid.reg.errInfo || "正则不匹配"
        }
    }
    return '';
}
