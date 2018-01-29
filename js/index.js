


!(function(factory) {
    "use strict";
    var getProto = Object.getPrototypeOf,
        version = '1.5.3', //to do 每次新增修改一个小版本，叠加到10进1
        rclass = /[\t\r\n\f]/g,
        a = undefined,
        arr = [],
        push = arr.push,
        class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty,
        typeName = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol'],
        eventName = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'touchenter', 'touchleave', 'blur', 'focus', 'focusin', 'focusout', 'resize', 'scroll', 'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'change', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'contextmenu', 'dragstart', 'drag', 'dragend', 'dragenter', 'orientationchange', 'tap', 'plusready'];

    ;factory(function(win, Hyman, doc) {
        Hyman.version = version;
        Hyman.Hyman = Hyman;
        // Hyman.prototype = Hyman;
        Hyman.win = win;
        Hyman.doc = doc;
        Hyman.debug = false;
        /**
         * 判断变量的类型  [Hyman.type]
         * @param  {[all]} obj []
         * @return {[string]}  输出类型名
         */
        Hyman.type = function(obj) {
            if (obj == a) {
                return obj + "";
            };
            return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        };
        /**
         * 判断是否为方法  [Hyman.isFn]
         * @param  {[all]}  obj []
         * @return {Boolean} ture or false
         */
        Hyman.isFn = function(obj) {
            return Hyman.type(obj) === "function";
        };
        /**
         * 判断是否为数组  [Hyman.isArray]
         * @param  {[all]}
         * @type {Boolean}
         */
        Hyman.isArray = Array.isArray;
        /**
         * 判断是否为对象  [Hyman.isObject]
         * @param  {[all]}
         * @type {Boolean}
         */
        Hyman.isObject = function(obj) {
            return Hyman.type(obj) === 'object';
        };
        /**
         * 判断是否为字符串  [Hyman.isString]
         * @param  {[all]}
         * @type {Boolean}
         */
        Hyman.isString = function(obj) {
            return Hyman.type(obj) === 'string';
        };
        /**
         * 转大写字母
         * @param  {[string]} str
         * @return {[str type]} 
         */
        Hyman.strUpp = function(str) {
            if (Hyman.isString(str)) {
                return str.toUpperCase();
            } else {
                return str;
            };
        };
        /**
         * 转小写字母
         * @param  {[string]} str
         * @return {[str type]} 
         */
        Hyman.strLow = function(str) {
            if (Hyman.isString(str)) {
                return str.toLowerCase();
            } else {
                return str;
            };
        };
        /**
         * 判断是否为顶级窗口  [Hyman.isWindow]
         * @param  {[all]}  obj []
         * @return {Boolean}  ture or false
         */
        Hyman.isWindow = function(obj) {
            return obj != a && obj === obj.window;
        };
        /**
         * 判断是否普通数组  [Hyman.isPlainArray]
         * @param  {[all]}  obj  []
         * @return {Boolean}  ture or false
         */
        Hyman.isPlainArray = function(obj) {
            var length, type = Hyman.type(obj);
            if (type === "function" || Hyman.isWindow(obj)) {
                return false;
            };
            length = Hyman.isArray(obj) && "length" in obj && obj.length;
            return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
        };
        /**
         * 判断是否为常规对象  [Hyman.isPlainObject]
         * @param  {[all]}  obj
         * @return {Boolean}
         */
        Hyman.isPlainObject = function(obj) {
            var proto, Ctor;
            if (!obj || Hyman.type(obj) !== "object") {
                return false;
            };
            proto = getProto(obj);
            if (!proto) {
                return true;
            };
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
        };
        /**
         * 生成数组  [Hyman.makeArray]
         * @param  {[all]} b     []
         * @param  {[all]} c     []
         * @return {[array]}  输出创建的数组对象
         */
        Hyman.makeArray = function(b, c) {
            var ret = !!b ? (Hyman.isPlainArray(b) ? b : [b]) : [];
            if (c != a) {
                if (Hyman.isPlainArray(c)) {
                    return Hyman.mergeArray(ret, c);
                } else {
                    push.call(ret, c);
                };
            };
            return ret;
        };
        /**
         * 合并多个数组  [Hyman.mergeArray]
         * @param {[array]}  [非数组自动过滤]
         * @return {[array]}  输出合并后的数组对象，不去重
         */
        Hyman.mergeArray = function() {
            var $arr = [];
            Hyman.each(arguments, function(i, args) {
                Hyman.each(args, function(j, arg) {
                    $arr.push(arg);
                });
            });
            return $arr;
        };
        /**
         * 多个数组去重  [Hyman.unrepeatArray]
         * @param {[array]}  [非数组自动过滤]
         * @return {[array]}   输出去重后的数组对象
         */
        Hyman.unrepeatArray = function() {
            var $arr = Hyman.mergeArray.apply(this, arguments);
            var $json = {},
                newArr = [];
            Hyman.each($arr, function(i, item) {
                var str = JSON.stringify(item, function(key, val) {
                    if (Hyman.type(val) === 'function') {
                        return val + '';
                    };
                    return val;
                });
                if (!$json[str]) {
                    $json[str] = true;
                    newArr.push(item);
                };
            });
            return newArr;
        };
        /**
         * 数组随机打乱顺序
         * @param  {[array]} arr [必须传递数组]
         * @return {[array]} 打乱后的数组
         */
        Hyman.rndArray = function(arr) {
            if (!Hyman.isArray(arr)) {
                return a;
            };
            arr.sort(rndSort);
            return arr;

            function rndSort(a, b) {
                return Math.random() > .5 ? -1 : 1;
            };
        };
        /**
         * console.log
         */
        Hyman.log = function() {
            Hyman.debug && console && console.log && console.log.apply(a, arguments);
        };
        /**
         * console.error
         */
        Hyman.error = function() {
            Hyman.debug && console && console.error && console.error.apply(a, arguments);
        };
        /**
         * 判断是否为数字  [Hyman.isNumeric]
         * @param  {[all]}  obj []
         * @return {Boolean}  [true, false]
         */
        Hyman.isNumeric = function(obj) {
            var type = Hyman.type(obj);
            return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj));
        };
        /**
         * 添加javascript文档，并随后删除  [Hyman.globalEval]
         * @param  {[string]} text [script内容]
         * @return {[script]}  输出script对象
         */
        Hyman.globalEval = function(text) {
            var script = doc.createElement("script");
            script.text = text;
            doc.head.appendChild(script).parentNode.removeChild(script);
            return script;
        };
        /**
         * 判断是否空对象  [Hyman.isEmptyObject]
         * @param  {[all]}  obj
         * @return {Boolean}
         */
        Hyman.isEmptyObject = function(obj) {
            var name;
            for (name in obj) {
                return false;
            };
            return true;
        };
        /**
         * 去除左右空格  [Hyman.trim]
         * @param  {[string]} text [需要去除左右空格的字符串]
         * @return {[string]}
         */
        Hyman.trim = function(text) {
            return text == a ? "" : (text + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        };
        /**
         * 获取当前时间 毫秒
         * @return {[number]}
         */
        Hyman.now = function(str) {
            var time
            if (str) {
                time = (new Date(str)).getTime();
            } else {
                time = (new Date()).getTime();
            };
            return time;
        };
        /**
         * 输出userAgent值  [Hyman.userAgent]
         * @return {[string]}  输出userAgent的值
         */
        Hyman.userAgent = function() {
            var userAgent = navigator.userAgent.toLowerCase();
            return userAgent;
        };
        /**
         * 获取浏览器源
         * @return {[object]}
         */
        Hyman.browser = (function() {
            var userAgent = Hyman.userAgent();
            return {
                version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
                safari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
                chrome: /chrome/.test(userAgent),
                opera: /opera/.test(userAgent),
                msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
                firefox: /firefox/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
            };
        })();
        //获取浏览器前缀
        Hyman.prefix = (function() {
            var styles = win.getComputedStyle(Hyman.doc.documentElement, '');
            var core = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
            return !core && '' || ('-' + core + '-');
        })();
        /**
         * 判断是否手机端  [Hyman.isMobile]
         * @return {Boolean} 输出是否手机端
         */
        Hyman.isMobile = function() {
            return /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(Hyman.userAgent());
        };
        /**
         * 判断是否微信端  [Hyman.isWeChart]
         * @return {Boolean} 输出是否微信端
         */
        Hyman.isWeChart = function() {
            return Hyman.userAgent().match(/micromessenger/i) == "micromessenger";
        };
        /**
         * 判断是否手机端点击事件  [Hyman.isClick]
         * @return {string} 手机端使用touchend执行点击事件
         */
        Hyman.isClick = function() {
            return Hyman.isMobile() && 'touchend' || 'click';
        };
        /**
         * 判断手机或pc端操作事件  [Hyman.mouse]
         * @param  {[string]} p [up松开，move移动，down按下]
         * @return {[string]}  输出指定设备事件
         */
        Hyman.mouse = function(p) {
            var data = {
                down: 'mousedown',
                move: 'mousemove',
                up: 'mouseup'
            };
            if (Hyman.isMobile()) {
                data = {
                    down: 'touchstart',
                    move: 'touchmove',
                    up: 'touchend'
                };
            };
            return data[p];
        };
        /**
         * 输出鼠标或者手机触摸坐标  [Hyman.getClient]
         * @param  {[mouseEvent]} e [操作事件object]
         * @return {[object]} 输出当前x,y坐标
         */
        Hyman.getClient = function(e) {
            var data = {
                x: e.clientX,
                y: e.clientY
            };
            if (Hyman.isMobile()) {
                data = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            };
            return data;
        };
        /**
         * 创建dom节点  [Hyman.newElem]
         * @param  {[object]} o  [attr所能添加的东西]
         * @param  {[object]} d  [html(string)参数和elems(array-element node)[节点, 节点]]
         * @param  {[string]} tag [标签名,默认为'div']
         * @return {[element node]} 输出创建成功的节点
         */
        Hyman.newElem = function(o, d, tag) {
            Hyman.isString(o) && (tag = o, o = {});
            Hyman.isString(d) && (tag = d, d = a);
            var $el = doc.createElement(tag || 'div');
            Hyman.each(o, function(k, val) {
                $el.setAttribute(k, val);
            });
            if (!!d) {
                !!d.html && ($el.innerHTML = d.html);
                if (!!d.elems) {
                    Hyman.each(d.elems, function(i, item) {
                        $el.appendChild(item);
                    });
                };
            };
            return $el;
        };
        /**
         * 操作事件object [Hyman.getTarget]
         * @param  {[mouseEvent]} e [操作事件object]
         * @return {[mouseEvent]}
         */
        Hyman.getTarget = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            return target;
        };
        /**
         * 获取dom 输出数组 [Hyman.$]
         * @param  {[element node]} elem [节点]
         * @return {[element node]} 输出当前节点或者jQuery节点
         */
        Hyman.$ = (function(obj) {
            return Hyman.isString(obj) && doc.querySelectorAll(obj) || Hyman.makeArray(obj);
        });
        /**
         * 清除html标签 [Hyman.removeStrTag]
         * @param  {[string]} str [需要清除标签的字符串]
         * @return {[string]} 输出已清除标签的字符串
         */
        Hyman.removeStrTag = function(str) {
            return str.replace(/<(?:.|\s)*?>/g, "");
        };
        /**
         * 清除字符串中script包括其内容 [Hyman.removeStrJs]
         * @param  {[string]} str [需要清除js标签的字符串]
         * @return {[string]} 输出不包含js标签的字符串
         */
        Hyman.removeStrJs = function(str) {
            return str.replace(/<script (?!src=)[\s\S]*?<\/script>/ig, '');
        };
        /**
         * Hyman.each
         */
        Hyman.each = function(obj, callback) {
            var length, i = 0,
                k;
            if (Hyman.isPlainObject(obj)) {
                for (k in obj) {
                    if (callback.call(obj[k], k, obj[k]) === false) {
                        break;
                    };
                };
            } else {
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    };
                };
            };
            return obj;
        };
        /**
         * Hyman.extend
         */
        Hyman.extend = function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            if (typeof target === "boolean") {
                deep = target;
                target = arguments[i] || {};
                i++;
            };
            if (typeof target !== "object" && !Hyman.isFn(target)) {
                target = {};
            };
            if (i === length) {
                target = this;
                i--;
            };
            for (; i < length; i++) {
                if ((options = arguments[i]) != a) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        };
                        if (deep && copy && (Hyman.isPlainObject(copy) || (copyIsArray = Hyman.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && Hyman.isArray(src) ? src : [];
                            } else {
                                clone = src && Hyman.isPlainObject(src) ? src : {};
                            };
                            target[name] = Hyman.extend(deep, clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        };
                    };
                };
            };
            return target;
        };
        Hyman.extend({ //全屏
            fullScreen: function() {
                var elem = Hyman.$('body')[0];
                if (elem.requestFullScreen) {
                    elem.requestFullScreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullScreen) {
                    elem.webkitRequestFullScreen();
                };
            }
        });
        /**
         * 简单节点操作
         */
        Hyman.extend({
            /**
             * 获取elem的所有class [Hyman.getClass]
             * @param  {[element node]} elem [节点]
             * @return {[string]}  输出当前节点所有样式名(空格隔开)
             */
            getClass: function(elem) {
                return elem.getAttribute && elem.getAttribute('class') && elem.getAttribute('class').replace(rclass, ' ').split(' ') || [];
            },
            /**
             * 判断是否包含该class名 [Hyman.hasClass]
             * @param  {[element node]} elem [节点]
             * @param  {[string]} arg  [样式名]
             * @return {Boolean}  输出判断是否包含
             */
            hasClass: function(elem, arg) {
                if (elem.nodeType !== 1) {
                    return false;
                };
                var flag = true,
                    args = arg.split(' '),
                    curVal = Hyman.getClass(elem);
                Hyman.each(args, function(i, val) {
                    if (curVal.indexOf(val) < 0) {
                        flag = false;
                    };
                });
                return flag;
            },
            /**
             * 设置elem的class [Hyman.setClass]
             * @param {[element node]} elem [节点]
             * @param {[string]} arg  [样式名，可多个样式名用空格分开]
             * @param {[boolean]} flag [true为添加样式名，false为删除样式名]
             * @return {[element node]} 输出当前节点
             */
            setClass: function(elem, arg, flag) {
                if (elem.nodeType !== 1) {
                    return elem;
                };
                var newVal = [],
                    curVal = Hyman.getClass(elem),
                    args = arg.split(' ');
                if (flag) {
                    newVal = Hyman.unrepeatArray(curVal, args);
                } else {
                    Hyman.each(curVal, function(i, val) {
                        if (args.indexOf(val) < 0) {
                            newVal.push(val);
                        };
                    });
                };
                if (args.length) {
                    elem.setAttribute("class", newVal.join(' '));
                };
                return elem;
            },
            /**
             * 添加样式名 [Hyman.addClass]
             * @param  {[element node]} elem [节点]
             * @param  {[string]} arg  [样式名，可多个样式名用空格分开]
             * @return {[object]}  输出当前节点
             */
            addClass: function(elem, arg) {
                return Hyman.setClass(elem, arg, true);
            },
            /**
             * 删除样式名 [Hyman.removeClass]
             * @param  {[element node]} elem [节点]
             * @param  {[string]} arg  [样式名，可多个样式名用空格分开]
             * @return {[object]}  输出当前节点
             */
            removeClass: function(elem, arg) {
                return Hyman.setClass(elem, arg);
            },
            /**
             * 添加兄弟节点  [Hyman.addSibling]
             * @param {[element node]} elem [添加到该节点之后]
             * @param {[element node]} nodeA [需要添加的节点]
             * @return {[element node]}  输出父级节点
             */
            addSibling: function(elem, nodeA) {
                var parent = elem.parentNode;
                if (parent.lastChild == elem) {
                    parent.appendChild(nodeA);
                } else {
                    parent.insertBefore(nodeA, elem.nextSibling);
                };
                return parent;
            },
            /**
             * 获取最近一级的父级节点 [Hyman.parentElem]
             * @param  {[element node]} elem  [节点]
             * @param  {[string]} className   [父级节点的样式名]
             * @return {[element node]}       [输出父级节点]
             */
            parentElem: function(elem, className) {
                if (!elem || !className) return;
                if (elem.nodeName.toLowerCase() === "body") return;
                if (Hyman.hasClass(elem.parentNode, className)) {
                    return elem.parentNode;
                } else {
                    return Hyman.parentElem(elem.parentNode, className);
                };
            },
            /**
             * 查找指定或者所有的兄弟节点 ----以下兄弟节点不包含自己
             * @param  {[element node]} elem  [节点]
             * 当前方法所有格式如下
             * ------ 一个节点或者为null ------
             * Hyman.siblings(elem, 'prev');         return node 或者 null   (返回当前节点的上一个节点)       --------------------- 非数组
             * Hyman.siblings(elem, 'next');         return node 或者 null   (返回当前节点的下一个节点)       --------------------- 非数组
             * Hyman.siblings(elem, '#id');          return node 或者 null   (返回兄弟节点id等于【id】的节点) --------------------- 非数组
             * ------ 节点数组或者为空数组 ------
             * Hyman.siblings(elem, 'div');          return []   (返回所有兄弟节点nodeName等于div的节点数组)
             * Hyman.siblings(elem, -1);             return []   (返回当前节点所有的上一个节点数组)
             * Hyman.siblings(elem, 1);              return []   (返回当前节点所有的下一个节点数组)
             * Hyman.siblings(elem, '.classname');   return []   (返回所有兄弟节点样式名等于【classname】的节点数组)
             * Hyman.siblings(elem);                 return []   返回所有兄弟节点数组
             * @return {[array]}      [节点-数组]
             */
            siblings: function(elem, param) {
                var i = 0,
                    $ps = Hyman.prevSiblings(elem),
                    $ns = Hyman.nextSiblings(elem);
                $ps = $ps.length > 0 ? $ps : [];
                if (param == -1) {
                    return $ps.reverse();
                } else if (param == 1) {
                    return $ns;
                } else if (param == 'next') {
                    return $ns.length > 0 ? $ns[0] : null;
                } else if (param == 'prev') {
                    return $ps.length > 0 ? $ps[0] : null;
                } else if (Hyman.isString(param)) {
                    var nn = param.substr(1),
                        $all = Hyman.mergeArray($ps.reverse(), $ns);
                    if (param.indexOf('#') == 0) {
                        for (; i < $all.length; i++) {
                            if ($all[i].id == nn) {
                                return $all[i];
                            };
                        };
                        return null;
                    } else if (param.indexOf('.') == 0) {
                        var $arr = [];
                        for (; i < $all.length; i++) {
                            if (Hyman.hasClass($all[i], nn)) {
                                $arr.push($all[i]);
                            };
                        };
                        return $arr;
                    } else {
                        var $arr = [];
                        for (; i < $all.length; i++) {
                            if (Hyman.strLow($all[i].nodeName) == Hyman.strLow(param)) {
                                $arr.push($all[i]);
                            };
                        };
                        return $arr;
                    };
                } else {
                    return Hyman.mergeArray([], $ps.reverse(), $ns);
                };
            },
            prevSiblings: function(elem) {
                var nodes = [];
                while ((elem = elem.previousSibling)) {
                    if (elem.nodeType == 1) {
                        nodes.push(elem);
                    };
                };
                return nodes;
            },
            nextSiblings: function(elem) {
                var nodes = [];
                while ((elem = elem.nextSibling)) {
                    if (elem.nodeType == 1) {
                        nodes.push(elem);
                    };
                };
                return nodes;
            }
        });
        /**
         * Hyman.getTemplate and Hyman.setTemplate
         */
        Hyman.extend({
            /**
             * 所有模版
             * @type {Object}
             */
            templateAll: {},
            /**
             * 获取模版内容 [Hyman.getTemplate]
             * @param {[string]} iden [唯一标识]
             * @return {[string]} 输出模版字符串
             */
            getTemplate: function(iden) {
                return Hyman.templateAll[iden];
            },
            /**
             * 设置模版 [Hyman.setTemplate]
             * @param {[string]} iden [唯一标识]
             * @param {[string]} html [模版内容]
             * @param {[boolean]} renewal [替换，false替换，true不替换]
             * @return {[string]} 输出唯一标识的模版字符串
             */
            setTemplate: function(iden, html, replace) {
                var flag = true;
                if (!!Hyman.templateAll[iden]) {
                    if (!replace) {
                        flag = false;
                    };
                };
                if (flag) {
                    Hyman.templateAll[iden] = html;
                };
                return Hyman.templateAll[iden];
            },
            //留空外部自定义
            addFmtTemplate: function(){},
            /**
             * 格式化模版---内置方法  [Hyman._fmtTemplate]
             * @param  {[string|number]}  a   需要转换的字符串或者数字
             * @param  {[string]}         b   转换格式 [number|date#yyyy-MM-dd时间格式|money#2位数]
             * @return {[type]} [description]
             */
            _fmtTemplate: function(a, b){
                var c, d;
                if (b == 'number') {
                    return a || 0;
                } else if (b && b.indexOf('date#') == 0) {
                    return a ? Hyman.stampToFmt(a, b.substr(5)) : '';
                } else if (b && b.indexOf('money#') == 0) {
                    return a ? Hyman.moneyToStr(a, +b.substr(6)) : '';
                } else if (b && b.indexOf('flag#') == 0) {
                    c = b.substr(5), d = [c, ''];
                    if(c.indexOf(':') > 0){ d = c.split(':'); };
                    return a == 1 ? d[0] : d[1];
                } else if(c = Hyman.addFmtTemplate(a, b), c !== undefined){
                    return c;
                } else {
                    return a || '';
                };
            },
            /**
             * 简易模版方法 [Hyman.template]
             */
            simTemplate: function(str, data) {
                var regex = /\{\{(.*?)\}\}/g;
                var result;
                var datas = {};
                if(!str){ return ''; };
                var $key, $param, $$key;
                while ((result = regex.exec(str)) != null) {
                    datas[result[1]] = true;
                };
                for (var k in datas) {
                    if (k.indexOf('|') > 0) {
                        var a = k.split('|');
                        $key = a[0];
                        $param = a[1];
                        $$key = $key + '\\\|' + $param;
                    } else {
                        $key = k;
                        $param = null;
                        $$key = k;
                    };
                    str = str.replace(new RegExp('({{' + $$key + '}})', 'g'), Hyman._fmtTemplate(data[$key], $param));
                };
                return str;
            }
        });
        /**
         * object type
         */
        Hyman.each(typeName, function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });
        /**
         * Hyman.ready
         */
        Hyman.extend({
            isReady: false,
            readyWait: false,
            readyErrorCount: 0,
            $readyList: [],
            ready: function(fn) {
                if (Hyman.isFn(fn)) {
                    Hyman.$readyList.push(fn);
                };
                if (Hyman.readyWait) {
                    Hyman.readyErrorCount++;
                    win.setTimeout(function() {
                        Hyman.ready();
                    }, 1);
                } else {
                    if (Hyman.isReady) {
                        Hyman.readyWait = true;
                        Hyman.$readyExe();
                    };
                };
            },
            $readyExe: function() {
                Hyman.each(Hyman.$readyList, function(i, fn) {
                    if (Hyman.isFn(fn)) {
                        fn.call(Hyman);
                        Hyman.$readyList[i] = a;
                    };
                });
                Hyman.readyWait = false;
            }
        });
        /**
         * 格式化插件集合
         */
        Hyman.extend({
            formatDate: 'yyyy-MM-dd',
            /**
             * 时间戳格式化  [Hyman.stampToFmt]
             * @param  {[date]} time [new Date格式]
             * @return {string} fmt  [输出的格式]
             */
            stampToFmt: function(time, fmt) {
                time += '';
                if (Hyman.isNumeric(time)) {
                    time.length != 13 && (time += '000');
                    time = new Date(parseInt(time));
                    return Hyman.timeTofmt(time, fmt);
                } else {
                    Hyman.log('\u65F6\u95F4\u6233\u683C\u5F0F\u4E0D\u6B63\u786E');
                };
                return a;
            },
            /**
             * 时间格式化  [Hyman.timeTofmt]
             * @param  {[date]} time [new Date格式]
             * @param  {[string]} fmt  [默认格式 yyyy-MM-dd]
             * @return {[string]}  [默认输出格式 yyyy-MM-dd]
             */
            timeTofmt: function(time, fmt) {
                !fmt && (fmt = Hyman.formatDate);
                var o = {
                    "M+": time.getMonth() + 1,
                    "d+": time.getDate(),
                    "h+": time.getHours(),
                    "m+": time.getMinutes(),
                    "s+": time.getSeconds(),
                    "q+": Math.floor((time.getMonth() + 3) / 3),
                    "S": time.getMilliseconds()
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                Hyman.each(o, function(k, item) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (item) : (("00" + item).substr(("" + item).length)));
                    };
                })
                return fmt;
            },
            /**
             * 格式化金额
             * @param  {[number|string]} s [金额]
             * @param  {[number]} n [保留位数]
             * @return {[string]}   输出格式化后的金额字符串
             */
            moneyToStr: function(s, n) {
                n = n > 0 && n <= 20 ? n : 2;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1],
                    t = "";
                for (var i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                };
                return t.split("").reverse().join("") + "." + r;
            },
            strToMoney: function(str) {
                return parseFloat(str.replace(/[^\d\.-]/g, ""));
            }
        });
        Hyman.extend({
            imgType: ['.jpeg', '.gif', '.jpg', '.png', '.bmp', '.pic'],
            imgDefaults: {
                statics: '',
                imgs: a,
                version: '',
                i: 0,
                l: 0,
                load: a,
                success: a,
                error: a
            },
            /**
             * 存放所有loadImg之后的路片
             * @type {Object}  {'原始路径': 'img元素'}
             */
            allImg: {},
            /**
             * 判断是否为图片文件名
             * @param  {[string]}  str  [图片路径字符串]
             * @return {Boolean}
             */
            isImg: function(str) {
                if (!Hyman.isString(str)) { return false; };
                if (str.indexOf(".") > -1) {
                    var p = str.lastIndexOf("."),
                        type = str.substring(p, str.length);
                    if (!type) { return false; };
                    if (Hyman.imgType.indexOf(Hyman.strLow(type)) > -1) {
                        return true;
                    };
                };
                return false;
            },
            /**
             * 查询对象中的图片，只对有后缀的文件有效
             * @param {[object]} obj [{}对象格式]
             * @param {[array]} $arr [内置变量]
             * @return {[array]} 输出查询出的数组对象
             */
            queryImg: function(obj, $arr) {
                if (!$arr) { $arr = []; };
                if (Hyman.isArray(obj) || Hyman.isObject(obj)) {
                    Hyman.each(obj, function(i, item) {
                        Hyman.queryImg(item, $arr);
                    });
                } else if (Hyman.isImg(obj)) {
                    $arr.push(obj);
                };
                return $arr;
            },
            /**
             * 预加载图片
             * @param  {[object]} opt [详情请查看Hyman.imgDefaults]
             * {
             *     其他详见Hyman.imgDefaults
             *     statics: 'string' //外部拓展文件根目录
             *     success: fn //imgs: 输出格式为{'原始路径': 'img元素'}
             *     load: fn //press：进度，imgs：{'原始路径': 'img元素'}，i：当前读取数，l：总数
             *     error: fn //imgs：{'原始路径': 'img元素'}，i：当前读取数，l：总数
             * }
             * @return {[a]} 
             */
            loadImg: function(opt) {
                var opts = Hyman.extend(false, Hyman.imgDefaults, opt);
                if (Hyman.isArray(opts.imgs)) {
                    opts.l = opts.imgs.length;
                    fn({});
                } else {
                    Hyman.log('param [imgs] is not Array!');
                    return;
                };

                function fn($imgs) {
                    if (opts.i >= opts.l) {
                        Hyman.isFn(opts.success) && opts.success.call(a, $imgs);
                        return;
                    };
                    var imgDB = opts.imgs[opts.i];
                    var db = Hyman.allImg[imgDB];
                    var val = parseFloat(((opts.i + 1) / opts.l * 100).toFixed(2));
                    if (!db) { //缓存图片，防止多次请求
                        var $img = new Image();
                        $img.onload = function() {
                            $imgs[imgDB] = this;
                            Hyman.allImg[imgDB] = this;
                            Hyman.isFn(opts.load) && opts.load.call(win, val, $imgs, opts.i, opts.l);
                            ++opts.i;
                            fn($imgs);
                        };
                        $img.onerror = function() {
                            Hyman.isFn(opts.error) && opts.error.call(win, $imgs, opts.i, opts.l);
                        };
                        $img.src = opts.statics + imgDB + opts.version;
                    } else {
                        $imgs[imgDB] = db;
                        Hyman.isFn(opts.load) && opts.load.call(win, val, $imgs, opts.i, opts.l);
                        ++opts.i;
                        fn($imgs);
                    };
                };
            }
        });
        /**
         * 监听事件  [缺点,只有addEventListener和removeEventListener事件,存在兼容问题]
         * to do [有待完善IE这些破浏览器的兼容问题]
         */
        Hyman.extend({
            /**
             * 监听事件的列表
             */
            _eventLists_: {},
            eventCount: 0,
            /**
             * 方法转字符串
             * @param  {[function]} fn [浅转换]
             * @return {[string|all]}
             */
            fnToStr: function(fn) {
                if (Hyman.isFn(fn)) {
                    return fn.toString().replace(/\s+/g, "").replace(rclass, "");
                } else {
                    return fn;
                };
            },
            /**
             * 查询该dom所绑定的所有事件   非addEvent绑定无效
             * @param {[element node]} elem [节点]
             * @param {[string]}       type [事件名]
             * @return {[object|array]} type为空，输出objcet 反之
             */
            queryEvents: function(elem, type) {
                var $arr = {};
                Hyman.each(Hyman._eventLists_, function(index, item) {
                    if (item.el === elem) {
                        if (!$arr[item.type]) {
                            $arr[item.type] = [];
                        };
                        $arr[item.type].push({
                            fn: item.fn,
                            index: index
                        });
                    };
                });
                if (type) {
                    return $arr[type] || [];
                } else {
                    return $arr;
                };
            },
            /**
             * 手机端点击事件 (不可多次注册)  [Hyman.tapEvent | Hyman.tap]
             * @param {element node} elem    [需要监听的节点]
             * @param  {Function}    fn      [点击后的事件]
             * @param  {[boolean]}   capture [冒泡]
             * @param  {[number]}    time    [点击时间不能超过多少毫秒，默认200]
             * @return {[function]}          [此处返回一个删除注册事件方法，可用于删除注册的事件]
             */
            tapEvent: function() {
                return Hyman.tap.apply(null, arguments);
            },
            tap: function(elem, fn, capture, time) {
                if (!elem.tap) {
                    elem.tap = !0;
                    if (Hyman.isMobile()) {
                        elem.tapTime = 0;
                        elem.tapMove = !1;
                        elem.tapA = Hyman.addEvent(elem, 'touchstart', function() {
                            elem.tapTime = Hyman.now();
                        }, capture);
                        elem.tapB = Hyman.addEvent(elem, 'touchmove', function() {
                            elem.tapMove = !0;
                        }, capture);
                        elem.tapC = Hyman.addEvent(elem, 'touchend', function() {
                            if (elem.tapMove) {
                                elem.tapMove = !1;
                                return;
                            };
                            if (Hyman.now() - elem.tapTime > (time || 250)) { return; };
                            elem.tapTime = 0;
                            Hyman.isFn(fn) && fn.apply(this, arguments);
                        }, capture);
                    } else {
                        elem.tapA = Hyman.addEvent(elem, 'click', function() {
                            Hyman.isFn(fn) && fn.apply(this, arguments);
                        }, capture);
                    };
                };
                return {
                    remove: function() {
                        elem.tap = !1;
                        Hyman.removeEvent(elem.tapA);
                        Hyman.removeEvent(elem.tapB);
                        Hyman.removeEvent(elem.tapC);
                    }
                };
            },
            /**
             * 手机端长按事件 (不可多次注册)  [Hyman.longtap]
             * @param {element node} elem    [需要监听的节点]
             * @param  {Function}    fn      [点击后的事件]
             * @param  {function}    fun     [点击后松开执行的事件]
             * @param  {[number]}    time    [长按多少毫秒之后执行fn，默认800]
             * @return {[function]}          [此处返回一个删除注册事件方法，可用于删除注册的事件]
             */
            longtap: function(elem, fn, fun, time) {
                if (!elem.longtap) {
                    elem.longtap = !0;
                    elem.longtapTime = null;
                    elem.longtapMove = !1;
                    if (Hyman.isMobile()) {
                        elem.longtapA = Hyman.addEvent(elem, 'touchstart', function() {
                            var args = arguments;
                            elem.longtapTime = setTimeout(function(that) {
                                if (elem.longtapMove) {
                                    elem.longtapMove = !1;
                                    return;
                                };
                                Hyman.isFn(fn) && fn.apply(that, args);
                            }, time || 800, this);
                        }, false);
                        elem.longtapB = Hyman.addEvent(elem, 'touchmove', function() {
                            elem.longtapMove = !0;
                        }, false);
                        elem.longtapC = Hyman.addEvent(elem, 'touchend', function() {
                            clearTimeout(elem.longtapTime);
                            Hyman.isFn(fun) && fun.apply(this, arguments);
                        }, false);
                        elem.longtapD = Hyman.addEvent(elem, 'touchcancel', function() {
                            clearTimeout(elem.longtapTime);
                            Hyman.isFn(fun) && fun.apply(this, arguments);
                        }, false);
                    };
                };
                return {
                    remove: function() {
                        elem.longtap = !1;
                        Hyman.removeEvent(elem.longtapA);
                        Hyman.removeEvent(elem.longtapB);
                        Hyman.removeEvent(elem.longtapC);
                        Hyman.removeEvent(elem.longtapD);
                    }
                };
            },
            /**
             * 添加监听事件  [Hyman.addEvent]
             * @param {element node} elem    [需要监听的节点]
             * @param {string}       type    [事件名]
             * @param {Function}     fn      [需要监听的方法]
             * @param {boolean}      capture
             */
            addEvent: function(elem, type, fn, capture) {
                if (!elem || eventName.indexOf(type) < 0 || !Hyman.isFn(fn)) {
                    Hyman.log('\u4E8B\u4EF6\u6CE8\u518C\u5931\u8D25!');
                    return;
                };
                var $index = -1;
                var len = Hyman.eventCount++;
                //防止重复监听相同的事件
                Hyman.each(Hyman._eventLists_, function(index, item) {
                    if (item.el === elem && item.type === type && Hyman.fnToStr(item.fn) === Hyman.fnToStr(fn) && item.capture == capture) {
                        $index = index;
                        return false;
                    };
                });
                if ($index == -1) {
                    Hyman._eventLists_[len] = {
                        el: elem,
                        type: type,
                        fn: fn,
                        capture: capture
                    };
                } else {
                    Hyman.log('\u8BE5\u65B9\u6CD5\u5DF2\u88AB\u76D1\u542C');
                    return $index;
                };
                if (doc.addEventListener) {
                    elem.addEventListener(type, fn, capture ? true : false);
                } else if (doc.attachEvent) {
                    elem.attachEvent(type, fn);
                } else {
                    Hyman.log('Error in page loading!');
                    return $index;
                };
                return len;
            },
            /**
             * 删除监听事件  [Hyman.removeEvent]  [缺点:容易造成误删除,随意的len值都可以执行删除]
             * @param {number}  index   [Hyman.addEvent return出来的内置参数]
             * @param {boolean} times [内置参数，可忽视]
             */
            removeEvent: function(index, times) {
                if (!Hyman._eventLists_[index]) {
                    Hyman.log('\u4E8B\u4EF6\u4E0D\u5B58\u5728!');
                    return;
                };
                var elem = Hyman._eventLists_[index].el;
                if (!elem) {
                    Hyman.log('\u8BE5\u4E8B\u4EF6\u4E0D\u5B58\u5728!');
                    return;
                };
                var type = Hyman._eventLists_[index].type;
                var fn = Hyman._eventLists_[index].fn;
                try {
                    if (doc.addEventListener) {
                        elem.removeEventListener(type, fn);
                    } else if (doc.attachEvent) {
                        elem.detachEvent(type, fn);
                    } else {
                        Hyman.log('Error in page loading!');
                    };
                    delete Hyman._eventLists_[index];
                } catch (e) {
                    if (!times) { //不重复执行报错程序
                        win.setTimeout(function() {
                            Hyman.removeEvent(index, true);
                        }, 15);
                    };
                };
            },
            /**
             * 删除所有事件     [Hyman.delAllEvent]
             * 感觉很鸡肋，万一有用呢
             */
            delAllEvent: function() {
                for (var i = 0; i < Hyman.eventCount; i++) {
                    Hyman.removeEvent(i);
                };
            }
        });
        //dom操作
        Hyman.extend({
            getWindow: function(elem){
                return Hyman.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
            },
            offset: function(el){
                var de, w, r, d;
                if (!el.getClientRects().length) {
                    return { top: 0, left: 0 };
                };
                r = el.getBoundingClientRect();
                if (r.width || r.height) {
                    d = el.ownerDocument;
                    w = Hyman.getWindow(d);
                    de = d.documentElement;
                    return {
                        top: r.top + w.pageYOffset - de.clientTop,
                        left: r.left + w.pageXOffset - de.clientLeft
                    };
                };
                return r;
            },
            style: function(elem){
                var style;
                if (win.getComputedStyle) {
                    style = win.getComputedStyle(elem, null);
                } else {
                    style = elem.currentStyle;
                };
                return style;
            }
        })
        Hyman.extend({
            // 移动：139, 138, 137, 136, 135, 134, 147, 150, 151, 152, 157, 158, 159, 178, 182, 183, 184, 187, 188
            // 联通：130, 131, 132, 155, 156, 185, 186, 145, 176 
            // 电信：133, 153, 177, 173, 180, 181, 189
            // 虚拟运营商：170, 171
            // 整理后：130~139, 14[57], 15[012356789], 17[013678], 180~189
            phoneReg: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
            /**
             * 判断是否手机号码
             * @param  {[number|string]}  tel [传入手机号码]
             * @return {Boolean}     是true否false手机号码
             */
            isPhone: function(tel) {
                if (tel && Hyman.phoneReg.test(tel)) {
                    return true;
                };
                return false;
            }
        });
        Hyman.extend({
            /**
             * 收集该对象的所有KEY  [Hyman.keyAll]
             * @param  {[object]} a [需要收集KEY的对象]
             * @return {[array]}   [输出KEY的数组]
             */
            keyAll: function(a) {
                var b = [];
                for (var k in a) {
                    b.push(k);
                };
                return b;
            },
            /**
             * 判断该KEY值是否存在   [Hyman.hasKey]
             * @param  {[object]}  a [需要判断的对象]
             * @param  {[string]}  k [需要判断的KEY]
             * @return {Boolean}   [输出是否存在]
             */
            hasKey: function(a, k) {
                return a[k] === undefined ? 0 : 1;
            },
            /**
             * 对比两个对象是否相同，一般设为内置函数，也可使用  [Hyman.simpleAlike]
             * @param  {[object]} a  [需要对比的对象a]
             * @param  {[object]} b  [需要对比的对象b]
             * @param  {[array]}  aStack  [初始状态下传入空数组]
             * @param  {[array]}  bStack  [初始状态下传入空数组]
             * @return {[Boolean]}    [对比两个对象是否相同]
             * 此方法来自于Underscore中的isEqual修改版
             */
            simpleAlike: function(a, b, aStack, bStack) {
                if (a === b) return a !== 0 || 1 / a === 1 / b;
                if (a == null || b == null) return a === b;
                if (a instanceof Hyman && b instanceof Hyman) return true;
                var className = toString.call(a);
                if (className !== toString.call(b)) return false;
                switch (className) {
                    case '[object RegExp]':
                    case '[object String]':
                        return '' + a === '' + b;
                    case '[object Number]':
                        if (+a !== +a) return +b !== +b;
                        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                    case '[object Date]':
                    case '[object Boolean]':
                        return +a === +b;
                    case '[object Function]':
                        return Hyman.fnToStr(a) === Hyman.fnToStr(b);
                };
                if (typeof a != 'object' || typeof b != 'object') return false;
                var length = aStack.length;
                while (length--) {
                    if (aStack[length] === a) return bStack[length] === b;
                };
                var aCtor = a.constructor,
                    bCtor = b.constructor;
                if (aCtor !== bCtor && 'constructor' in a && 'constructor' in b && !(Hyman.isFn(aCtor) && aCtor instanceof aCtor && Hyman.isFn(bCtor) && bCtor instanceof bCtor)) {
                    return false;
                };
                aStack.push(a);
                bStack.push(b);
                var size, result;
                if (className === '[object Array]') {
                    size = a.length;
                    result = size === b.length;
                    if (result) {
                        while (size--) {
                            if (!(result = Hyman.simpleAlike(a[size], b[size], aStack, bStack))) {
                                break;
                            };
                        };
                    };
                } else {
                    var keys = Hyman.keyAll(a),
                        key;
                    size = keys.length;
                    result = Hyman.keyAll(b).length === size;
                    if (result) {
                        while (size--) {
                            key = keys[size];
                            if (!(result = Hyman.hasKey(b, key) && Hyman.simpleAlike(a[key], b[key], aStack, bStack))) {
                                break;
                            };
                        };
                    };
                };
                aStack.pop();
                bStack.pop();
                return result;
            },
            /**
             * 对比两个对象是否相同   [Hyman.isIden]
             * @param  {[object]} a  [需要对比的对象a]
             * @param  {[object]} b  [需要对比的对象b]
             * @return {[Boolean]}    [对比两个对象是否相同]
             */
            isIden: function(a, b) {
                return Hyman.simpleAlike(a, b, [], []);
            }
        });
        Hyman.extend({
            resizeWidth: 640,
            resizeEvent: null,
            resizeEvt: 'orientationchange' in win ? 'orientationchange' : 'resize',
            autoHtmlWidth: function() {
                Hyman.setHtmlWidth();
                Hyman.resizeEvent = Hyman.addEvent(win, Hyman.resizeEvt, Hyman.setHtmlWidth, false);
            },
            setHtmlWidth: function() {
                var docEl = win.document.documentElement,
                    recalc = function() {
                        var clientWidth = docEl.clientWidth;
                        if (!clientWidth) return;
                        if(!Hyman.isMobile()){
                            Hyman.delHtmlWidth();
                            return;
                        };
                        clientWidth > Hyman.resizeWidth && (clientWidth = Hyman.resizeWidth);
                        docEl.style.fontSize = (10 / .117187) * (clientWidth / 320) + 'px';
                    };
                return recalc();
            },
            delHtmlWidth: function() {
                var docEl = win.document.documentElement;
                docEl.style.fontSize = '';
                Hyman.removeEvent(Hyman.resizeEvent);
            }
        });
        Hyman.ready(function() {
            //自动接收页面中的模版，并且删除页面中的模版
            var tpl = this.doc.querySelectorAll('[type="text/template"]');
            for (var i = 0, l = tpl.length; i < l; i++) {
                Hyman.setTemplate(tpl[i].id, tpl[i].innerHTML, true);
                try {
                    tpl[i].remove();
                } catch (e) {};
            };
        });
        ;(function() {
            function completed() {
                if (doc.addEventListener) {
                    doc.removeEventListener("DOMContentLoaded", completed, false);
                    win.removeEventListener("load", completed, false);
                    Hyman.isReady = true;
                    Hyman.ready();
                } else if (doc.attachEvent) {
                    doc.detachEvent("onreadystatechange", completed);
                    doc.detachEvent("onload", completed);
                    Hyman.isReady = true;
                    Hyman.ready();
                } else {
                    Hyman.log('Error in page loading!');
                };
            };
            if (doc.readyState === "complete" || (doc.readyState !== "loading" && !doc.documentElement.doScroll)) {
                win.setTimeout(Hyman.ready, 1);
            } else {
                if (doc.addEventListener) {
                    doc.addEventListener("DOMContentLoaded", completed, false);
                    win.addEventListener("load", completed, false);
                } else if (doc.attachEvent) {
                    doc.attachEvent("onreadystatechange", completed);
                    win.attachEvent("onload", completed);
                } else {
                    Hyman.log('Error in page loading!');
                };
            };
            //判断是否是否启用HTML设置字体
            //<script type="text/javascript" src="./js/Hyman.js" data-width="640"></script>根据 【data-html="640"】 判断是否启用html手机通用字体rem
            var scripts = Hyman.$('script');
            for (var i = 0; i < scripts.length; i++) {
                var item = scripts[i];
                var width = item.getAttribute('data-width'); //设置最大宽度 默认为640
                if (item && item.src && (item.src.indexOf('/Hyman.js') > -1 || item.src.indexOf('/Hyman.min.js') > -1) && width) {
                    if (Hyman.isNumeric(width)) { Hyman.resizeWidth = parseInt(width); };
                    Hyman.autoHtmlWidth();
                };
            };
        })();
    });
})((function(win) {
    "use strict";
    var swch = '\/\/\u5BD2\u8F69\u51FA\u54C1\uFF0C\u611F\u8C22\u652F\u6301\uFF0C';
    var doc = win.document;
    if (!!doc) {
        win.Hyman = win.Hyman || new Function(swch);
        return function(factory) {
            factory(win, win.Hyman, doc);
        };
    } else {
        throw new Error("Hyman requires a window with a document!");
    };
})(window));