import Vue from 'vue'
import Axios from 'axios'
(function(window,Vue,axios) {
    var Util = {};

    /**
     * 作者 林立
     * 日期 20170311
     * 
     */
    Util.copyObject = function(target, source) {

        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
    }

    /**
     * 作者 林立
     * 日期 20170311
     * 为一个Vue的data添加一个新的属性,如果是数组, 则为每一项都添加一个新的属性
     */
    Util.addVueDataProperty = function($vue, source, key, defaultValue) {
        if (source instanceof Array) {
            for (var idx = 0; idx < source.length; idx++) {
                var item = source[idx];
                $vue.$set(item, key, defaultValue)
            }
        } else {
            $vue.$set(source, key, defaultValue)
        }
    }
    /**
     * 作者 刘德华
     * 日期 20170310
     * 取出url需要的字段名 = 后面的属性
     * 用法 Util.getUrlParam(id);
     */
    //获取url参数
    Util.getUrlParam = function(key) {
        // 获取URL中?之后的字符
        var str = location.search;
        str = str.substring(1, str.length);
        // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
        var arr = str.split('&');
        var obj = new Object();
        // 将每一个数组元素以=分隔并赋给obj对象         
        for (var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split('=');
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
        }
        return obj[key];
    }
    Util.getFullImagePath = function(path, basePath) {
        if (path.indexOf('http') > -1) {
            return path;
        } else {
            return basePath + path;
        }
    }
    Util.propsArrayToString = function(array) {
        var resultArray = []
        for (var i = 0; i < array.length; i++) {
            var current = array[i]
            resultArray.push(current.id + ':' + current.value)
        }

        return resultArray.join(',')
    }

    /**
     * 作者 林立
     * 日期 20170310
     * 把json对象转成URL形式
     * param: json
     * key: 转成url之后,给每个参数附加一个父节点, 比如 key.p1=1
     */
    Util.parseParam = function(param, key) {
        var paramStr = '';
        var me = this;
        if (param instanceof String || param instanceof Number || param instanceof Boolean) {
            var value = encodeURIComponent(param);
            if (value)
                paramStr += '&' + key + '=' + value;
        } else {
            var index = 0;
            for (var prop in param) {
                var k = key == null ? index : key + (param instanceof Array ? '[' + index + ']' : '.' + index);
                var value = me.parseParam(this, k)
                if (value)
                    paramStr += '&' + value;
            	index++;
            }
        }
        return paramStr.substr(1);
    }
    Util.trim = function(val) {
        return val.replace(/(^\s*)|(\s*$)/g, '');
    }

    Util.parseForm = function(data) {
        var param = '';
        if (Util.getType(data) == 'String') {
            param = data;
        } else if (Util.getType(data) == 'Object') {
            for (var prop in data) {
                if (Util.getType(data[prop]) == 'String' ||
                    Util.getType(data[prop]) == 'Number' ||
                    Util.getType(data[prop]) == 'Boolean') {
                    var value = encodeURIComponent(data[prop]);
                    if (value)
                        param += '&' + prop + '=' + value;
                } else if (Util.getType(data[prop]) == 'Array') {
                    var propValue = data[prop];
                    for (var i = 0; i < propValue.length; i++) {
                        for (var key in propValue[i]) {
                            var value = encodeURIComponent(propValue[i][key]);
                            param += '&' + prop + '[' + i + '].' + key + '=' + value;
                        }
                    }
                }
            }
            param = param.substr(1);
        }
        return param;
    }
    Util.getType = function(object) {
            var typeName = Object.prototype.toString.call(object);
            return typeName.substring(8, typeName.length - 1);
    }
    window.Util = Util;
})(window,Vue,Axios);