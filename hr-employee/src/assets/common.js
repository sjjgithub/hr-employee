import Vue from 'vue'

(function(window) {
    var Common = {};

    //中国标准时间转换为自己想要的格式
    // 用法  Common.formatChinaTime(dateValue,'yyyy-MM-dd HH:mm:ss')
    Common.formatChinaTime  = function(time,  format) {
            var  t  =  new  Date(time);
            var  tf  =   function(i) { return  (i  <  10  ?  '0'  :  '')  +  i };
            return  format.replace(/yyyy|MM|dd|HH|mm|ss/g,  function(a) {
                switch (a) {
                    case  'yyyy':
                                        return  tf(t.getFullYear());
                        break;
                    case  'MM':
                                        return  tf(t.getMonth()  +  1);
                        break;
                    case  'mm':
                                        return  tf(t.getMinutes());
                        break;
                    case  'dd':
                                        return  tf(t.getDate());
                        break;
                    case  'HH':
                                        return  tf(t.getHours());
                        break;
                    case  'ss':
                                        return  tf(t.getSeconds());
                        break;
                }
            })
        }
        // 字符串截取
        // 用法 Common.strCutout(str,'想要截取的类型')
    Common.strCutout = function(str, cutType) {
            var result = str.split(cutType);
            var list = [];
            for (var i = 0; i < result.length; i++) {
                list.push(result[i])
            }
            return list;
        }
        // 对象添加新属性
        // 用法 obj = addProperty(原对象, 新对象);
    Common.addProperty = function(obj1, obj2) {
            for (var r in obj2) {
                eval("obj1." + r + "=obj2." + r);
            }
            return obj1;
        }
        // 深拷贝对象
    Common.deepCopyObj = function(obj) {
        if (typeof obj != 'object') {
            return obj;
        }
        var newobj = {};
        for (var attr in obj) {
            newobj[attr] = Common.deepCopyObj(obj[attr]);
        }
        return newobj;
    }
    window.Common = Common
})(window);

//时间戳转换为自己想要的格式
// 用法  new Date(dateValue).format('yyyy-MM-dd hh:mm:ss')
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

//时间戳过滤器
Vue.filter('dateMin', function(value) {
    if (value) {
        return new Date(value).format('yyyy-MM-dd hh:mm')
    } else {
        return "-"
    }
});

Vue.filter('dateD', function(value) {
    if (value) {
        return new Date(value).format('yyyy-MM-dd')
    } else {
        return "-"
    }
});
Vue.filter('timeFormat', function(value, type) {
    if (value) {
        return new Date(value).format(type)
    } else {
        return "-"
    }
});

export default {
    install: function(Vue) {
        Vue.Common
    }
}