/**
 * 公共的数字软键盘组件
 * @param {object} option
 * @param {string} option.elem (最好是id)
 * @param {string} option.theme 主题 可以是rgb #ededed #eee
 * @param {string} option.type 类型 整数、金钱、浮点数、身份证号、数字
 * @param {int} option.length 长度限制（整数的）
 * @param {string} option.cancelColor 取消按钮文字的颜色
 * @param {string} option.confirmColor 确定按钮文字的颜色
 * @param {int} option.precision 小数点后的位数 （只有在是浮点数的情况下才会有）
 * @param {string} option.template html模板的id(废弃)
 * @param {function} option.onconfirm 点击确定需要的回调函数
 * @param {function} option.oncancel 点击取消需要的回调函数
 * @param {layerID} ID
 */
function numberKeyBoard(option) {
    this.option = dave.extend(true, dave.defaultParam, option);
    this.hasDom = false;
    this.ID = '';
    this.numberBody = '';
};

numberKeyBoard.prototype = {
    init: function(){
        // 生成DOM
        this.createDom();
    },
    createDom: function(){
        var template = dave.getTemplate();
            this.numberBody = document.createElement('div');
            this.numberBody.className = "number-body"; 
            this.ID = this.getID()();
            this.numberBody.id = this.ID;
            this.numberBody.innerHTML = template;
        document.body.appendChild(this.numberBody);
        hasDom = true;
        this.setCss();
        this.showNumKeyboard();
        this.bindEvent();
    },
    getID: function() {
        var id = 'number_body';
        var i = 0 ;
        return getMyID = function(){
                if (dave.$('#' + id)) {
                    id = id + (i++);
                    return getMyID();
                } else {
                    return id;
                }
            }
    },
    // 添加换肤功能
    setCss: function(){
        this.$css = dave.newElem({
            type: 'text/css',
            media: 'screen'
        }, {
            html: this.cssCont()
        }, 'style');
        dave.$('head')[0].appendChild(this.$css);
    },
    //判断是否颜色
    isColor: function() {
        return this.option.theme.indexOf('#') === 0 || this.option.theme.indexOf('rgb') === 0 || false;
    },
    // 获取css的内容
    cssCont: function(){
        if(!this.isColor()) {
            return;
        }
        var $css = [],
            colors = this.setColor(this.option.theme);
        // $css.push('#' + this.ID + ' .number-content,');
        // $css.push('#' + this.ID + ' .number-top,');
        $css.push('#' + this.ID + ' .number-cont {');
        $css.push('background-color: ' + colors[8] + ';}');
        $css.push('#' + this.ID + ' .number-keyboard-item.disable {');
        $css.push('background-color: ' + colors[5] + ';}');
        $css.push('#' + this.ID + ' .number-keyboard-item {');
        $css.push('background-color: ' + colors[2] + ';');
        if (colors[2].substr(1, 1) === 'f') {
            $css.push('color: #000;');
        }else {
            $css.push('color: #fff;');
        }
        $css.push('}');
        return $css.join('');
    },
    // 根据主题的颜色，设置整个区块的颜色
    setColor: function(theme){
        var color = [];
        if(theme.indexOf('#') === 0) {
            color = this.hexToRgb(theme);
        } else if(theme.indexOf('rgb') ===0) {
            var reg = /rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([.\d]+))?\)/,
                rgb = theme.replace(/\s+/g, "").match(reg);
            color.push(rgb[1]);
            color.push(rgb[2]);
            color.push(rgb[3]);
        }
        return this.calcColor(color);
    },
    // 将hex转换成rgb的形式
    hexToRgb: function(theme){
        if(theme.length !== 4 && theme.length !== 7) return;
        var hex = [], hexr, hexg, hexb, themeList = theme.split('');
        if (theme.length === 4) {
            hexr = themeList[1] + themeList[1];
            hexg = themeList[2] + themeList[2];
            hexb = themeList[3] + themeList[3];
        }else {
            hexr = themeList[1] + themeList[2];
            hexg = themeList[3] + themeList[4];
            hexb = themeList[5] + themeList[6];
        }
        hex.push(parseInt(hexr,16).toString(10));
        hex.push(parseInt(hexg,16).toString(10));
        hex.push(parseInt(hexb,16).toString(10));
        return hex;
    },
    rgbToHex: function(value){
        var reg = /rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([.\d]+))?\)/,
            rgb = value.replace(/\s+/g, "").match(reg),
            r = parseInt(rgb[1], 10).toString(16).length === 1 ? '0' + parseInt(rgb[1], 10).toString(16) : parseInt(rgb[1], 10).toString(16);
            g = parseInt(rgb[2], 10).toString(16).length === 1 ? '0' + parseInt(rgb[2], 10).toString(16) : parseInt(rgb[2], 10).toString(16);
            b = parseInt(rgb[3], 10).toString(16).length === 1 ? '0' + parseInt(rgb[3], 10).toString(16) : parseInt(rgb[3], 10).toString(16);
        return '#' + r + g + b;
    },
    // 计算颜色值
    calcColor: function(color) {
        var colors = [];
        if(!color) {
            return colors;
        }
        var r = +color[0] - 0,
            g = +color[1] - 0,
            b = +color[2] - 0,
            or = (255 - color[0]) / 10 | 0,
            og = (255 - color[1]) / 10 | 0,
            ob = (255 - color[2]) / 10 | 0,
            i = 0;
        for (i = 0; i < 10; i++) {
            colors.push(this.rgbToHex('rgb(' + (r + or * i) + ',' + (g + og * i) + ',' + (b + ob * i) + ')'));
        }
        return colors;
    },
    bindEvent: function(){
        var _this = this;
        dave.$('#' + this.ID).onclick= function(ev){
            var target = dave.getTarget(ev);
            if (target.id === 'number_cancel') {
                _this.handleCancel(ev);
            }
            else if (target.id === 'number_confirm') {
                _this.handleConfirm(ev);
            }
            else if (target.nodeName.toLowerCase() == 'li') {
                var targetClass = target.className;
                if (targetClass.indexOf('disable') > -1) {
                    return;
                } else {
                    _this.handleAddNum(target);
                }
            }
        }
    },
    showNumKeyboard: function(){
        var elem = dave.$('#' + this.option.elem),
            showInput = this.getElems('id', 'number_showNum');
        showInput.value = elem.value;
        dave.$('#' + this.ID).style.display = 'block';
        this.setKayboard();
    },
    setKayboard: function(){
        var type = this.option.type,
            specialCode = this.getElems('class', 'number-keyboard-item').item(9),
            showInput = this.getElems('id', 'number_showNum'),
            items = this.getElems('class', 'number-keyboard-item');
        if (type === 'certId') {
            specialCode.innerHTML = 'X';
            if (showInput.value.length === 17) {
                this.allKey(items)
            } else if(showInput.value.length < 17) {
                this.allNum(items);
            } else {
                this.noneKey(items);
            }
        } else {
            specialCode.innerHTML = '.';

            if (type === 'number') {
                if (!this.option.length) {
                    this.allNum(items);
                };
                if (showInput.value.length === this.option.length) {
                    this.noneKey(items);
                }
            }

            if (type === 'interge') {
                if (showInput.value.length === 0) {
                    this.severalNoneKey(items, [10]);
                } else {
                    this.allNum(items);
                }
            }

            if (type === 'phone') {
                if (showInput.value.length === 0) {
                    this.severalKey(items, [0]);
                } else if (showInput.value.length === 1) {
                    this.severalKey(items, [2,3,4,6,7]);
                } else if(showInput.value.length === 11){
                    this.noneKey(items);
                } else {
                    this.allNum(items);
                }
            }

            if (type === 'money' || type === 'float') {
                this.allNum(items);
                if (showInput.value.length === 1) {
                    if (showInput.value === '0') {
                        this.severalKey(items, [9]);
                    } else {
                        this.allKey(items);
                    }
                } else if (showInput.value.length > 1) {
                    if (showInput.value.indexOf('.') > -1) {
                        var floatList = showInput.value.split('.');
                        if (type === 'money') {
                            if (floatList[1].length === 2) {
                                this.noneKey(items);
                            } else {
                                this.allNum(items);
                            }
                        }else {
                            if (floatList[1].length === this.option.precision) {
                                this.noneKey(items);
                            } else {
                                this.allNum(items);
                            }
                        }
                    } else {
                        var maxLength = this.option.length || 8;
                        if(showInput.value.length === maxLength) {
                            this.noneKey(items);
                        } else {
                            this.allKey(items);
                        }
                    }
                }
            }

            if (type === 'number' || type === 'interge' || type === 'phone' || (((type === 'money') || (type === 'float')) && showInput.value.indexOf('.') > -1) || (((type === 'money') || (type === 'float')) && showInput.value.length === 0)) {
                this.nonePoint(specialCode);
            } else {
                this.point(specialCode);
            }
        }
    },
    handleAddNum: function(target) {
        var showInput = document.getElementById('number_showNum');
        if(target.innerHTML !== 'x') {
            showInput.value += target.innerHTML;
            this.setKayboard();
        } else {
            showInput.value = showInput.value.substr(0, showInput.value.length-1);
            this.setKayboard();
        }
    },
    allKey: function(items){
        var i = 0, itemLength = items.length-1;
        for (i = 0; i < itemLength; i++) {
            if (items.item(i).className.indexOf('disable') > -1) {
                items.item(i).className = items.item(i).className.replace(' disable', '');
            }
        }
    },
    allNum: function(items){
        var i = 0, itemLength = items.length-1;
        for (i = 0; i < itemLength; i++) {
            if (i === 9) {
                if (items.item(i).className.indexOf('disable') === -1) {
                    items.item(i).className += ' disable';
                }
                continue;
            };
            if (items.item(i).className.indexOf('disable') > -1) {
                items.item(i).className = items.item(i).className.replace(' disable', '');
            }
        }
    },
    noneNum: function(items){
        var i = 0, itemLength = items.length-1;
        for (i = 0; i < itemLength; i++) {
            if (i === 9) {
                if (items.item(i).className.indexOf('disable') > -1) {
                    items.item(i).className = items.item(i).className.replace(' disable', '');
                }
                continue;
            }
            if (items.item(i).className.indexOf('disable') === -1) {
                items.item(i).className += ' disable';
            }
        }
    },
    noneKey: function(items){
        var i = 0, itemLength = items.length-1;
        for (i = 0; i < itemLength; i++) {
            if (items.item(i).className.indexOf('disable') === -1) {
                items.item(i).className += ' disable';
            }
        }
    },
    nonePoint: function(specialCode){
        if (specialCode.className.indexOf('disable') === -1) {
            specialCode.className += ' disable';
        }
    },
    point: function(specialCode){
        if (specialCode.className.indexOf('disable') > -1) {
            specialCode.className = specialCode.className.replace(' disable', '');
        }
    },
    severalKey: function(items, arrIndex){
        var i = 0, itemLength = items.length-1;
        for (i = 0; i < itemLength; i++) {
            if (arrIndex.indexOf(i) > -1){
                if (items.item(i).className.indexOf('disable') > -1) {
                    items.item(i).className = items.item(i).className.replace(' disable', '');
                }
                continue;
            }
            if (items.item(i).className.indexOf('disable') === -1) {
                items.item(i).className += ' disable';
            }
        }
    },
    severalNoneKey: function(items, arrIndex){
        var i = 0, itemLength = items.length-1;
        for (i = 0; i < itemLength; i++) {
            if (arrIndex.indexOf(i) > -1){
                if (items.item(i).className.indexOf('disable') === -1) {
                    items.item(i).className += ' disable';
                }
                continue;
            }
            if (items.item(i).className.indexOf('disable') > -1) {
                items.item(i).className = items.item(i).className.replace(' disable', '');
            }
        }
    },
    // 自动补充后缀
    addprix: function(offetNum){
        var i = 0,
            suffixLength = this.option.precision - offetNum,
            suffix = '';
        for (i = 0; i < suffixLength; i++) {
            suffix += '0';
        }
        return suffix;
    },
    checkInput: function() {
        var showInput = this.getElems('id', 'number_showNum');
        var inputValueList = showInput.value.split('.');
        if (inputValueList.length === 2) {
            if((!inputValueList[1].length && inputValueList[0] !== '0') || (inputValueList[1].length < this.option.precision && (inputValueList[0] !== '0' || inputValueList[1] - 0 !== 0))){
                showInput.value += this.addprix(inputValueList[1].length);
            }
        }
        if (inputValueList[0] === '0' && inputValueList[1] - 0 === 0) {
            return false;
        }
        if (dave[this.option.type + 'Reg'].test(showInput.value)) {
            return true;
        }
        return false;
    },
    getElems: function(type, value){
        if (type === 'id') {
            return dave.$('#' + this.ID + ' #'+ value);
        } else if (type === 'class') {
            return dave.$('#' + this.ID + ' .'+ value);
        } else if (type === 'nodeName') {
            return dave.$('#' + this.ID + ' '+ value);
        }
    },
    handleConfirm: function(){
        var showInput = this.getElems('id', 'number_showNum'),
            msgMask = this.getElems('class', 'number-inner-maskBg').item(0),
            magCont = this.getElems('class', 'number-inner-message').item(0);
        if (!this.checkInput()) {
            msgMask.style.display = 'block';
            magCont.style.display = 'block';
            magCont.innerHTML = '请输入正确的信息';
            setTimeout(function() {
                msgMask.style.display = 'none';
                magCont.style.display = 'none';
            }, 1000);
            return;
        }
        if (this.option.onConfirm && toString.call(this.option.onConfirm) === '[object Function]') {
            this.option.onConfirm(showInput.value);
        } else {
            var elem = dave.$('#' + this.option.elem);
            elem.value = showInput.value; 
        }
        document.body.removeChild(this.numberBody);
        dave.$('head').item(0).removeChild(this.$css);
    },
    handleCancel: function(){
        var showInput = this.getElems('id', 'number_showNum');
        if (this.option.onCancel && toString.call(this.option.onCancel) === '[object Function]') {
            this.option.onCancel();
        }
        // dave.$('#' + this.ID).style.display = 'none';
        document.body.removeChild(this.numberBody)
        dave.$('head').item(0).removeChild(this.$css);
    }
};

/*-------------------------tool---------------------------------*/

window.dave = {
    defaultParam: {
        theme: '#ffffff',
        type: 'number',
        precision: '2'
    },
    extend: function() {
        // 默认不进行深拷贝
        var deep = false;
        var name, options, src, copy;
        var length = arguments.length;
        // 记录要复制的对象的下标
        var i = 1;
        // 第一个参数不传布尔值的情况下，target默认是第一个参数
        var target = arguments[0] || {};
        // 如果第一个参数是布尔值，第二个参数是才是target
        if (typeof target == 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        // 如果target不是对象，我们是无法进行复制的，所以设为{}
        if (typeof target !== 'object') {
            target = {}
        }
    
        // 循环遍历要复制的对象们
        for (; i < length; i++) {
            // 获取当前对象
            options = arguments[i];
            // 要求不能为空 避免extend(a,,b)这种情况
            if (options != null) {
                for (name in options) {
                    // 目标属性值
                    src = target[name];
                    // 要复制的对象的属性值
                    copy = options[name];
    
                    if (deep && copy && typeof copy == 'object') {
                        // 递归调用
                        target[name] = extend(deep, src, copy);
                    }
                    else if (copy !== undefined){
                        target[name] = copy;
                    }
                }
            }
        }
    
        return target;
    },
    newElem: function(attrs, inner, name){
        var elem = document.createElement(name);
        for(var k in attrs) {
            elem.k = attrs.k;
        }
        elem.innerHTML = inner.html;
        return elem;
    },
    $: function(name){
        var selectList = name.split(' ');
        return selectList[selectList.length - 1].indexOf('#')  > -1 ? document.querySelector(name) : document.querySelectorAll(name);
    },
    getTarget: function(){
        var ev = ev || window.event;
        return ev.target || ev.srcElement;
    },
    proxyClick: function(option){
        var _this = this;
        document.onclick = function(ev) {
            var target = _this.getTarget(ev);
            if (target.id === option.elem) {
                this.keyboard = new numberKeyBoard(option);
                this.keyboard.init();
            }
        };
    },
    virmKeyboard: function(option){
        this.proxyClick(option);
    },
    parents: function(elem, attrVal){
        if (!node || node.nodeName.toLowerCase() === 'body'){
            return null;
        }
        return node.parentNode; 
    },
    getTemplate: function(){
        var templateList = [];
        templateList.push('<div class="numberMaskbg"></div>');
        templateList.push('<div class="number-content">');
        templateList.push('<div class="number-top"><a href="javascript:void(0);" class="number-cancel" id="number_cancel">取消</a><a href="javascript:void(0);" class="number-confirm" id="number_confirm">确定</a><div class="number-showNum"><input type="text" name="" readonly id="number_showNum"></div></div>');
        
        templateList.push('<div class="number-cont"><ul class="number-keyboard" id="number_keyboard">')
        for (var i =0; i < 12; i++) {
            if (i < 9){
                templateList.push('<li class="number-keyboard-item">' + (i + 1) + '</li>');
            } else if (i === 9) {
                templateList.push('<li class="number-keyboard-item">.</li>');
            } else if (i === 10) {
                templateList.push('<li class="number-keyboard-item">0</li>');
            } else {
                templateList.push('<li class="number-keyboard-item">x</li>');
            }
        }
        templateList.push('</ul></div>');
        templateList.push('<div class="number-inner-maskBg"></div>');
        templateList.push('<div class="number-inner-message"></div>');
        templateList.push('</div>');
        return templateList.join('');
    },
    moneyReg: /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/,
    certIdReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    floatReg: /^(0|[1-9][0-9]*)+(.[0-9]*)?$/,
    numberReg: /^([0-9]*)$/,
    phoneReg: /^1(3|4|5|7|8)\d{9}$/
};

