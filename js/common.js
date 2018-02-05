
/*-------------------------tool---------------------------------*/

window.dave = {
    keyboard: null,
    optionsList:[],
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
    proxyClick: function(optionsList){
        var _this = this;
        document.onclick = function(ev) {
            var target = _this.getTarget(ev),
                i = 0, l = optionsList.length;
            for (i = 0; i < l; i++) {
                if (target.id === optionsList[i].elem) {
                    _this.keyboard = new numberKeyBoard(optionsList[i]);
                    _this.keyboard.init();
                }
            }
        };
    },
    virmKeyboard: function(option){
        if (!this.isInArr(option, this.optionsList)) {
            this.optionsList.push(option);
        }
        this.proxyClick(this.optionsList);
    },
    isInArr: function(item, list) {
        var a = JSON.stringify(item), i = 0, l = list.length;
        for (i = 0; i < l; i++) {
            if (a === JSON.stringify(list[i])) {
                return true;
            }
        }
        return false;
    },
    parents: function(elem, attrVal){
        if (!node || node.nodeName.toLowerCase() === 'body'){
            return null;
        }
        return node.parentNode; 
    },
    getTemplate: function(){
        var templateList = [],
            characterLowList = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
            characterUpperList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        templateList.push('<div class="keyboardMaskbg"></div>');
        templateList.push('<div class="keyboard-inner-message"></div>');
        
        templateList.push('<div class="keyboard-content">');
        templateList.push('<div class="keyboard-top"><a href="javascript:void(0);" class="keyboard-cancel" id="keyboard_cancel">取消</a><a href="javascript:void(0);" class="keyboard-confirm" id="keyboard_confirm">确定</a><div class="keyboard-showNum"><input type="text" name="" readonly id="keyboard_showNum"></div></div>');
        // 字母键盘
        templateList.push('<div class="character-cont">')
        templateList.push('<ul class="character-lower-keyboard" id="character_lower_keyboard">');
        for (var i = 0; i < 26; i++) {
            templateList.push('<li class="character-lower-item key-item">' + characterLowList[i] + '</li>');
        }
        templateList.push('<li class="character-lower-item caLock toUpper key-item"><i class="flag"></i></li>');
        templateList.push('</ul>');
        templateList.push('<ul class="character-upper-keyboard" id="character_upper_keyboard">')
        for (var i = 0; i < 26; i++) {
            templateList.push('<li class="character-upper-item key-item">' + characterUpperList[i] + '</li>');
        }
        templateList.push('<li class="character-upper-item caLock toLower key-item"><i class="flag"></i></li>');
        templateList.push('</ul>');
        templateList.push('<ul class="operSym">')
        templateList.push('<li class="character-special-item key-item">Num</li>');
        templateList.push('<li class="character-special-item key-item">@</li>');
        templateList.push('<li class="character-special-item key-item">_</li>');
        templateList.push('<li class="character-special-item key-item">-</li>');
        templateList.push('<li class="character-special-item key-item">×</li>');
        templateList.push('</ul></div>');

        // 数字键盘
        templateList.push('<div class="number-cont"><ul class="number-keyboard" id="number_keyboard">');
        for (var i =0; i < 13; i++) {
            if (i < 9){
                templateList.push('<li class="number-keyboard-item key-item">' + (i + 1) + '</li>');
            } else if (i === 9) {
                templateList.push('<li class="number-special-item key-item">En</li>');
            } else if (i === 10) {
                templateList.push('<li class="number-special-item key-item">.</li>');
            } else if (i === 11) {
                templateList.push('<li class="number-special-item key-item">0</li>');
            } else {
                templateList.push('<li class="number-special-item key-item">×</li>');
            }
        }
        templateList.push('</ul></div>');
        // templateList.push('<div class="keyboard-inner-maskBg"></div>');
        templateList.push('</div>');
        return templateList.join('');
    },
    moneyReg: /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/,
    certIdReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    floatReg: /^(0|[1-9][0-9]*)+(.[0-9]*)?$/,
    numberReg: /^([0-9]*)$/,
    phoneReg: /^1(3|4|5|7|8)\d{9}$/,
    intergeReg: /^[1-9][0-9]*$/,
    email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
    characterReg: /^[A-Za-z]+$/,
    lowerCharReg: /^[a-z]+$/,
    upperCharReg: /^[A-Z]+$/,
    charAndNum: /^[A-Za-z0-9]+$/,
    passwordReg: /^[a-zA-Z]\w{5,17}$/
};
