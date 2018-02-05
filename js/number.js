/**
 * 公共的数字软键盘组件
 * @param {object} option
 * @param {string} option.elem (最好是id)
 * @param {string} option.theme 主题 可以是rgb #ededed #eee
 * @param {string} option.type 类型 金钱、浮点数、身份证号、数字、电话号码
 * @param {int} option.length 长度限制（数字、电话号码）
 * @param {string} option.minValue 最小值 (金钱、浮点数) 必须是整数
 * @param {string} option.maxValue 最大值 （金钱、浮点数）必须是整数
 * @param {string} option.cancelColor 取消按钮文字的颜色
 * @param {string} option.confirmColor 确定按钮文字的颜色
 * @param {int} option.precision 小数点后的位数 （只有在是浮点数的情况下才会有，如果为0，则是整数）
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
    this.message = '';
    this.contType = 'num';
};

numberKeyBoard.prototype = {
    init: function(){
        // 生成DOM
        this.createDom();
    },
    createDom: function(){
        var template = dave.getTemplate();
            this.numberBody = document.createElement('div');
            this.numberBody.className = "keyboard-body"; 
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
        if (colors[5].substr(1, 2) > 'ee' && colors[5].substr(3, 2) > 'ee' && colors[5].substr(5, 2) > 'ee') {
            
        }else {
            $css.push('#' + this.ID + ' .number-cont {');
            $css.push('background-color: ' + colors[8] + ';}');
            $css.push('#' + this.ID + ' .number-keyboard-item.disable {');
            $css.push('background-color: ' + colors[5] + ';}');
            $css.push('#' + this.ID + ' .number-keyboard-item {');
            $css.push('background-color: ' + colors[2] + ';');
            $css.push('color: #fff;');
            $css.push('}');   
        }
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
            if (target.id === 'keyboard_cancel') {
                _this.handleCancel(ev);
            }
            else if (target.id === 'keyboard_confirm') {
                _this.handleConfirm(ev);
            }
            else if (target.parentNode.nodeName.toLowerCase() == 'li' || target.nodeName.toLowerCase() == 'li') {
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
            t = this.option.type,
            showInput = this.getElems('id', 'keyboard_showNum');
        showInput.value = elem.value;
        dave.$('#' + this.ID).style.display = 'block';
        if (t === 'upperChar') {
            this.contType = 'uc';
        } else if (t === 'lowerChar' || t === 'character' || t === 'email' || t === 'password' || t === 'charAndNum') {
            this.contType = 'lc';
        } else {
            this.contType = 'num';
        }
        this.setKeyboard();
    },
    certIdNum: function(numItems, lowerItems, upperItems, charOper, showInput){
        // specialCode.innerHTML = 'X';
        this.severalKey(charOper, [0]);
        this.severalKey(lowerItems, [23]);
        this.severalKey(upperItems, [23]);
        if (showInput.value.length === 17) {
            this.allKey(numItems)
        } else if(showInput.value.length < 17) {
            this.severalNoneKey(numItems, [9]);
        } else {
            this.noneKey(charOper);
            this.noneKey(numItems);
            this.noneKey(lowerItems);
            this.noneKey(upperItems);
        }
    },
    numberNum: function(items, showInput){
        this.allNum(items);
        if (!this.option.length) {
            return;
        };
        if (showInput.value.length === this.option.length) {
            this.noneKey(items);
        }
    },
    phoneNum: function(items, showInput){
        if (showInput.value.length === 0) {
            this.severalKey(items, [0]);
        } else if (showInput.value.length === 1) {
            this.severalKey(items, [2,3,4,6,7]);
        } else if(showInput.value.length === 11){
            this.noneKey(items);
        } else {
            this.allNum(items);
        }
    },
    floatNum: function(items, showInput){
        this.allNum(items);
            if (!showInput.value.length) {
                var maxValue = this.option.maxValue;
                if (maxValue) {
                    if (maxValue.length === 1){
                        this.severalKey(items, this.getKeys(maxValue));
                    }
                }
            } else if (showInput.value.length === 1) {
                if (showInput.value === '0') {
                    this.severalKey(items, [9]);
                } else {
                    var maxValue = this.option.maxValue || 999999999;
                    if (maxValue) {
                        if (Math.floor(maxValue/showInput.value) < 10) {
                            this.severalKey(items, [9])
                        } else if(Math.floor(maxValue/showInput.value) === 10) {
                            var k = maxValue - (showInput.value * 10);
                            this.severalKey(items, this.getKeys(k));
                        } else {
                            var f = maxValue - (showInput.value * 10);
                            if (f < 9) {
                                this.severalKey(items, this.getKeys(f));
                            } else {
                                this.allKey(items);
                            }
                        }
                    } else {
                        this.allKey(items);
                    }
                }
            } else if (showInput.value.length > 1) {
                if (showInput.value.indexOf('.') > -1) {
                    var floatList = showInput.value.split('.');
                    if (this.option.type === 'money') {
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
                    var maxValue = this.option.maxValue || 999999999;
                    if (!maxValue) {
                        this.allKey(items);
                    } else {
                        if(Math.floor(maxValue/showInput.value) < 10) {
                            this.noneKey(items);
                        } else if (Math.floor(maxValue/showInput.value) === 10) {
                            var lastMaxNum = maxValue - (showInput.value * 10);
                            if (lastMaxNum < 9) {
                                this.severalKey(items, this.getKeys(lastMaxNum));
                            } else {
                                this.allKey(items);
                            }
                        } else if (Math.floor(maxValue/showInput.value) > 10) {
                            this.allKey(items);
                        }
                    }
                }
            }
    },
    getKeys: function(n){
        var keys = [],
            i = 0;
        for (i = 0; i < n + 1; i++) {
            if (i === 0) {
                keys.push(10);
            } else {
                keys.push(i);
            }
        }
        return keys;
    },
    showblock: function(t) {
        var numCont = this.getElems('class', 'number-cont').item(0),
            characterCont = this.getElems('class', 'character-cont').item(0);
        numCont.style.display = 'none';
        characterCont.style.display = 'none';
        if (t === 'num') {
            numCont.style.display = 'block';
        } else if (t === 'lc' || t === 'uc') {
            characterCont.style.display = 'block';
            if (t === 'uc') {
                this.getElems('class', 'character-upper-keyboard').item(0).style.display = 'block';
                this.getElems('class', 'character-lower-keyboard').item(0).style.display = 'none';
            } else {
                this.getElems('class', 'character-lower-keyboard').item(0).style.display = 'block';
                this.getElems('class', 'character-upper-keyboard').item(0).style.display = 'none';
            }
        }
    },
    character: function(items, showInput) {
        this.allKey(items);
        if (!this.option.length) {
            return;
        };
        if (showInput.value.length === this.option.length) {
            this.noneKey(items);
        }
    },
    emailChar: function(numItems, lowerItems, upperItems, charOper, showInput) {
        this.allKey(numItems);
        this.allKey(lowerItems);
        this.allKey(upperItems);
        this.allKey(charOper);
        if (!showInput.value.length) {
            this.severalNoneKey(charOper, [1, 2, 3]);
            this.severalNoneKey(numItems, [10])
            return;
        }
        if (showInput.value.indexOf('@') > -1) {
            this.severalNoneKey(charOper, [1]);
            var c = showInput.value.split('@'),
                k = c[c.length-1];
            if (!k) {
                this.severalNoneKey(charOper, [1, 2, 3]);
                this.severalNoneKey(numItems, [10])
            }
        } else {
            this.severalNoneKey(numItems, [10])
        }
        var l = showInput.value.split('.'),
            a = l[l.length-1];
        
        if (!a) {
            this.severalNoneKey(charOper, [1, 2, 3]);
            this.severalNoneKey(numItems, [10])
            return;
        }

        if (a.length === 5) {
            this.noneKey(charOper);
            this.noneKey(lowerItems);
            this.noneKey(upperItems);
            this.severalKey(numItems, [9, 10])
        }
    },
    passwordNum: function (numItems, lowerItems, upperItems, charOper, showInput) {
        this.severalNoneKey(numItems, [10]);
        this.allKey(lowerItems);
        this.allKey(upperItems);
        this.severalNoneKey(charOper, [3]);
        var l = this.option.length, a;
        if (l) {
            a = l.split(',');
            if (a.length === 1 && showInput.value.length >= (a[0] - 0)) {
                this.noneKey(numItems);
                this.noneKey(lowerItems);
                this.noneKey(upperItems);
                this.noneKey(charOper);
            } else if(a.length === 2 && showInput.value.length >= (a[1] - 0)) {
                this.noneKey(numItems);
                this.noneKey(lowerItems);
                this.noneKey(upperItems);
                this.noneKey(charOper);
            }
        }
    },
    charAndNum: function(numItems, lowerItems, upperItems, charOper, showInput) {
        this.severalNoneKey(numItems, [10]);
        this.allKey(lowerItems);
        this.allKey(upperItems);
        this.noneKey(charOper);
        var l = this.option.length, a;
        if (l) {
            a = l.split(',');
            if (a.length === 1 && showInput.value.length >= (a[0] - 0)) {
                this.noneKey(numItems);
                this.noneKey(lowerItems);
                this.noneKey(upperItems);
                this.noneKey(charOper);
            } else if(a.length === 2 && showInput.value.length >= (a[1] - 0)) {
                this.noneKey(numItems);
                this.noneKey(lowerItems);
                this.noneKey(upperItems);
                this.noneKey(charOper);
            }
        }
    },
    setKeyboard: function(){
        var t = this.option.type,
            specialCode = this.getElems('class', 'number-cont .key-item').item(10), // 只是针对数字的 . 符号
            showInput = this.getElems('id', 'keyboard_showNum'),
            numItems = this.getElems('class', 'number-cont .key-item'),
            lowerCharItems = this.getElems('class', 'character-lower-keyboard .key-item'), // 小写字母的切换
            upperCharItems = this.getElems('class', 'character-upper-keyboard .key-item'), // 大写字母的切换
            numChange = this.getElems('class', 'number-cont .key-item').item(9), // 数子的切换英文的按钮
            charChange = this.getElems('class', 'operSym .key-item').item(0), // 英文切换成数组的按钮
            charOper = this.getElems('class', 'operSym .key-item'),
            charToUpper = this.getElems('class', 'character-lower-keyboard .key-item').item(26), // 小写切换成大写 英文的切换数字的按钮
            charToLower = this.getElems('class', 'character-upper-keyboard .key-item').item(26); // 大写切换成小写 英文的切换数字的按钮
        // specialCode.innerHTML = '.';
        this.showblock(this.contType);
        // 身份证的长度是默认好的
        if (t === 'certId') {
            this.certIdNum(numItems, lowerCharItems, upperCharItems, charOper, showInput);
        } 
        // 如果是数字
        if (t === 'number') {
            this.numberNum(numItems, showInput);
        }
        
        // 电话号码的规则是相对固定的
        if (t === 'phone') {
            this.phoneNum(numItems, showInput);
        }
        // 如果是金钱和浮点数，和长度关系不大，只和最大值还有最小值有关，以及精度有关
        if (t === 'money' || t === 'float') {
            this.floatNum(numItems, showInput);
        }
        // 做统一处理，出发到这个条件，那个特殊的.就置灰，没有触发的话就放开
        if (t === 'number' || t === 'certId' || t === 'interge' || t === 'password' || t === 'phone' || (t === 'float' && !this.option.precision) || (((t === 'money') || (t === 'float')) && showInput.value.indexOf('.') > -1) || (((t === 'money') || (t === 'float')) && showInput.value.length === 0)) {
            this.nonePoint(specialCode);
        } else {
            this.point(specialCode);
        }

        if(t === 'lowerChar') {
            this.noneOper(charOper);
            this.character(lowerCharItems, showInput);
        }
        if (t === 'upperChar') {
            this.noneOper(charOper);
            this.character(upperCharItems, showInput);
        }
        if (t === 'character') {
            this.noneOper(charOper);
            this.character(lowerCharItems, showInput);
            this.character(upperCharItems, showInput);
        }
        if (t === 'email') {
            this.emailChar(numItems, lowerCharItems, upperCharItems, charOper, showInput);
        }
        if (t === 'password') {
            this.passwordNum(numItems, lowerCharItems, upperCharItems, charOper, showInput);
        }
        if (t === 'charAndNum') {
            this.charAndNum(numItems, lowerCharItems, upperCharItems, charOper, showInput);
        }

        if (t === 'password' || t === 'email' || t === 'charAndNum') {
            numChange.className = numChange.className.replace(' disable', '');
            charChange.className = charChange.className.replace(' disable', '');
        } else if (t === 'character' || t === 'lowerChar' || t ===  'upperChar') {
            if (charChange.className.indexOf('disable') === -1) {
                charChange.className += ' disable';
            }
            if (t === 'lowerChar') {
                if(charToUpper.className.indexOf('disable') === -1) {
                    charToUpper.className += ' disable';
                }
            } else if (t ===  'upperChar') {
                if (charToLower.className.indexOf('disable') === -1) {
                    charToLower.className += ' disable';
                }
            }
        } else if(t !== 'certId'){
            if (numChange.className.indexOf('disable') === -1) {
                numChange.className += ' disable';
            }
            // numChange.className += ' disable';
        }
    },
    handleAddNum: function(target) {
        var showInput = document.getElementById('keyboard_showNum');
        if(target.innerHTML !== '×') {
            if(target.innerHTML === 'En') {
                this.contType ='lc';
            } else if(target.innerHTML === 'Num') {
                this.contType ='num';
            } else if(target.className.indexOf('caLock') > -1) {
                if (target.className.indexOf('toLower') > -1) {
                    this.contType = 'lc';
                } else {
                    this.contType ='uc';
                }
            } else if(target.className.indexOf('flag') > -1) {
                if (this.contType === 'lc') {
                    this.contType ='uc';
                } else {
                    this.contType = 'lc';
                }
            } else {
                showInput.value += target.innerHTML;
            }
        } else {
            showInput.value = showInput.value.substr(0, showInput.value.length-1);
        }
        this.setKeyboard();
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
    noneOper: function(items) {
        var i = 0, itemLength = items.length-1;
        for (i = 1; i < itemLength; i++) {
            if (items.item(i).className.indexOf('disable') === -1) {
                items.item(i).className += ' disable';
            }
        }
    },
    oper: function(items) {
        var i = 0, itemLength = items.length-1;
        for (i = 1; i < itemLength; i++) {
            if (items.item(i).className.indexOf('disable') > -1) {
                items.item(i).className = items.item(i).className.replace(' disable', '');
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
        var showInput = this.getElems('id', 'keyboard_showNum');
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
            if (['money', 'float'].indexOf(this.option.type) > -1) {
                var minValue = this.option.minValue || 0,
                    maxValue = this.option.maxValue || 999999999;
                if (!maxValue) {
                    if (showInput.value < minValue) {
                        this.message = '请输入大于' + minValue + '的值';
                        return false;
                    }
                } else {
                    if (showInput.value < minValue || showInput.value > maxValue) {
                        this.message = '请输入' + minValue + '到' + maxValue + '之间的值';
                        return false;
                    }
                }
            }
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
        var _this = this,
            showInput = this.getElems('id', 'keyboard_showNum'),
            numContent = this.getElems('class', 'keyboard-content').item(0),
            // msgMask = this.getElems('class', 'keyboard-inner-maskBg').item(0),
            magCont = this.getElems('class', 'keyboard-inner-message').item(0);
        if (!this.checkInput()) {
            if (!this.message) {
                this.message = '请输入正确的信息';
            }
            magCont.innerHTML = this.message;
            numContent.style.display = 'none';
            magCont.style.display = 'block';
            setTimeout(function() {
                document.body.removeChild(_this.numberBody);
                dave.$('head').item(0).removeChild(_this.$css);
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
        var showInput = this.getElems('id', 'keyboard_showNum');
        if (this.option.onCancel && toString.call(this.option.onCancel) === '[object Function]') {
            this.option.onCancel();
        }
        // dave.$('#' + this.ID).style.display = 'none';
        document.body.removeChild(this.numberBody)
        dave.$('head').item(0).removeChild(this.$css);
    }
};