/*
 * Timeout handle
 */
var KisBpmTimeoutCtrl = ['$scope', '$modal', function ($scope, $modal) {

  //把选中节点的所有属性从数组转化为对象（浅拷贝）
  setSelectedItemPros($scope);

	// Config for the modal window
	var opts = {
		template: 'editor-app/configuration/properties/timeout-popup.html?version=' + Date.now(),
		scope: $scope,
		backdrop: 'static'
	};

  //初始化类型默认为‘不处理’,延期规则为空字符串
  $scope.timeout = $scope.timeout ? $scope.timeout : {'type': 'ignore', 'delayRule': ''};

  //初始化$scope.property.value为空对象
  if (!$scope.property.value || !$scope.property.value !== {}) {
    $scope.property.value = {}
  }

  //设置Model里显示的类型
  $scope.timeout.typeOptions = [
    {
      "key": "ignore",
      "value": "不处理"
    },
    {
      "key": "delayTime",
      "value": "不处理并延迟过期时间"
    },
    {
      "key": "skip",
      "value": "自动到下一个节点"
    },
    {
      "key": "termination",
      "value": "终止流程"
    },
    {
      "key": "callInterface",
      "value": "调用外部接口"
    }
  ];

	// Open the dialog
	$modal(opts);
}];

var KisBpmTimeoutPopupCtrl = ['$scope', '$modal', function ($scope, $modal) {
  
  var curPros = $scope.selectedItemPros;
  var timeout = $scope.timeout;
  var curDate = curPros['oryx-duedatedefinition'];  //当前节点的到期的日期

  //初始化当前节点的任务监听器
  if (!curPros['oryx-tasklisteners'].value.taskListeners) {
    curPros['oryx-tasklisteners'].value = {
      'taskListeners': []
    }
  }
  var curTasklistener = curPros['oryx-tasklisteners'];
  var curPro = $scope.property;

  // 如果任务监听器未设置过，需要先初始化
  if (curTasklistener.value === {} || curTasklistener.value === null
    || curTasklistener.value === undefined || curTasklistener.value === '') {
    curTasklistener.value = {'taskListeners': []};
  }
  var curValue = curTasklistener.value;

  /*回填超时时间*/
  timeout.time = splitTime(curDate.value);

  /*回填类型*/
  fillTimeoutType(curValue, timeout, $scope);

  /*保存*/
  $scope.save = function() {
    /*校验超时时间，只能填正整数*/
    if(!validTime(timeout.time)) {
      return;
    }

    /*设置到期的日期*/
    curDate.value = timeout.time ? joinTime(timeout.time) : '';
    $scope.updatePropertyInModel(curDate);
    
    /*设置任务监听器*/
    var listeners = curValue.taskListeners;

    //如果类型为不处理，则清空超时监听器
    if (timeout.type === 'ignore' ) {
      for (var j = 0; j < listeners.length; j ++) {
        //判断是否存在超时监听器，如果存在，则删除
        if (listeners[j].isTimeoutListener) {
          listeners.splice(j, 1);
        }
      }
      //如果没有任何监听器，则清空value
      if (!listeners.length) {
        curTasklistener.value = '';
      }
    } else {
      // 建立一个超时处理的任务监听元素
      var listener = {
        "event": timeoutConfig.event,
        "className": timeoutConfig.className,
        "isTimeoutListener": true,  //标志该任务监听器是超时处理
        "fields": [{}]
      };

      //超时处理任务监听器填值
      var fields = listener.fields;
      if(timeout.type) {
        if (timeout.type === 'delayTime') { //类型为不处理并自动延迟过期时间的fields[0]和其他不一样
          fields[0].name = timeoutConfig.delayTimeFieldsName;
          fields[0].expression = timeout.delayRule ?
            '${' + timeout.delayRule + timeoutConfig.delayTimeExpression : '';
        } else {
          fields[0].name = timeoutConfig.fieldsName;
          fields[0].stringValue = timeout.type;
        }

        //类型选择调用外部接口需要再加一个field
        if (timeout.type === 'callInterface') {
          fields[1] = {};
          fields[1].name = timeoutConfig.fieldsCallInterfaceName;
          fields[1].stringValue = timeout.interface;
        }
      }

      var flag = false;
      for (var i = 0; i < listeners.length; i ++) {
        //判断是否存在超时监听器，如果存在，则替换
        if(listeners[i].isTimeoutListener) {
          listeners[i] = listener;
          flag = true;
          break;
        }
      }
      // 如果不存在，则push
      if (!flag) {
        curValue.taskListeners.push(listener);
      }
    }

    //填写设置超时的value，以便回填设置超时
    curPro.value.type = timeout.type;
    $scope.updatePropertyInModel(curPro);

    //回填设置超时
    setTimeoutInputContent($scope);

    $scope.updatePropertyInModel(curTasklistener);
    $scope.close();

  };

  //取消
  $scope.close = function() {
    //回填类型
    fillTimeoutType(curValue, timeout, $scope);

    //回填设置超时
    setTimeoutInputContent($scope);

    $scope.property.mode = 'read';
    $scope.$hide();
  };

}];

/*拼接超时时间*/
function joinTime(time) {
  var day = isNum(time.day) ? time.day + 'D' : '';
  var hour = isNum(time.hour) > 0 ? time.hour + 'H' : '';
  var minute = isNum(time.minute) > 0 ? time.minute + 'M' : '';
  if (day && (hour || minute)) {
    return 'P' + day + 'T' + hour + minute;
  } else if (hour || minute) {
    return 'P' + 'T' + hour + minute
  }
  return '';
}

/*判断是否是正数，且不是空字符*/
function isNum(num) {
  return num.length && parseInt(num) > 0;
}

/*拆分超时时间*/
function splitTime(time) {
  var arr = time.substr(1).split('T');
  var day = arr[0].length > 1 ? arr[0].substr(0, arr[0].length - 1) : '';
  var hour = '';
  var minute = '';
  if (arr[1]) {
    if (arr[1].indexOf('H') !== -1) {
      var arr2 = arr[1].split('H');
      hour = arr2[0];
      minute =  arr2[1].indexOf('M') !== -1? arr2[1].slice(0, arr2[1].length - 1) : '';
    } else {
      minute = arr[1].indexOf('M') !== -1? arr[1].slice(0, arr[1].length - 1) : '';
    }
  }
   return {
    'day': day,
    'hour': hour,
    'minute': minute
  };
}

/*校验超时时间*/
function validTime(time) {
  var reg = /^([1-9]\d*)$/;
  if ((time.day.length && !reg.test(time.day)) || (time.hour.length && !reg.test(time.hour))
    || (time.minute.length && !reg.test(time.minute))) {
    toastr.error('超时时间只能填正整数');
    return false;
  }
  return true;
}

//回填类型
function fillTimeoutType(curValue, timeout, $scope) {
  if (curValue.taskListeners) {
    var listeners = curValue.taskListeners;
    var flag = false;
    for (var k = 0; k < listeners.length; k ++) {
      var listener = listeners[k];
      if(listener.isTimeoutListener) {  //判断是否是超时监听器
        //当在任务监听器里删掉了超时监听器的fields，则默认为不处理
        timeout.type = listener.fields[0] ? listener.fields[0].stringValue : 'ignore';

        //类型为不处理并延迟过期时间
        if(listener.fields[0] && listener.fields[0].name === timeoutConfig.delayTimeFieldsName) {
          timeout.type = 'delayTime';
          var temp = listener.fields[0].expression.split(timeoutConfig.delayTimeExpression);
          timeout.delayRule = temp[0].slice(2);
        }

        // 回填外部接口
        if (timeout.type === 'callInterface') {
          //当在任务监听器里删掉了超时监听器的fields，则默认为''
          timeout.interface = listener.fields[1] ? listener.fields[1].stringValue : '';
        }
        flag = true;
        break;
      }
    }
    if (!flag && $scope.selectedItemPros['oryx-timeout'].value) { //超时类型为“不处理”
      timeout.type = 'ignore';
    }
  }
}

//设置超时input框信息
function setTimeoutInputContent($scope) {
  if($scope.timeout) {
    var options = $scope.timeout.typeOptions;
    for (var i = 0; i < options.length; i++) {
      if (options[i].key === $scope.timeout.type) {
        $scope.property.value.inputContent = options[i].value;
        break;
      }
    }
  }
}
