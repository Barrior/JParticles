//snow.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        sin = Math.sin,
        pi2 = Math.PI * 2,
        UNDEFINED = 'undefined';

    function Wave( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Wave.configDefault, options );

        this.initAttr();
        this.createDot();
        this.draw();
        this.resize();
    }

    Wave.configDefault = {
        //全局透明度
        opacity: 1,
        //线条颜色
        color: [],
        //线条个数
        num: null,
        //线条宽度
        lineWidth: [],
        //线段的横向偏移值，(0, 1)表示波长的倍数，0 & [1, +∞)表示具体数值
        offsetLeft: [],
        //线条中点到元素顶部的距离，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
        offsetTop: [],
        //波峰数值，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
        crest: [],
        //波纹个数，即正弦周期个数
        rippleNum: [],
        //运动速度
        speed: [],
        //是否绘制成区域图
        area: false,
        //是否绘制边框
        stroke: true,
        //自适应窗口尺寸变化
        resize: true
    };


    Wave.prototype = {
        version: '1.0.0',
        initAttr: function(){
            var self = this;
            var cw = self.cw;
            var ch = self.ch;
            var set = self.set;
            var isArray = Array.isArray;
            var randomColor = util.randomColor;
            var limitRandom = util.limitRandom;
            //线条数量
            var num = set.num = set.num || limitRandom( ch / 2, 1 );
            //线条波长，每个周期(2π)在canvas上的实际长度
            var rippleLength = this.rippleLength = [];

            'color lineWidth offsetLeft offsetTop crest rippleNum speed area stroke'.split(' ')
                .forEach(function( attr ){
                    attrNormalize( attr );
                });

            function attrNormalize( attr ){
                var val = set[ attr ];
                if( isArray( val ) ){
                    //将crest: []或[2]或[2, 2], 转换成crest: [2, 2, 2]
                    if( attr === 'offsetTop' || attr === 'crest' ||  attr === 'offsetLeft' ){
                        var arg = attr === 'offsetLeft' ? cw : ch;
                        for( var i = 0; i < num; i++ ){
                            val[i] = typeof val[i] === UNDEFINED ?
                                getAttr( attr ) : scale( val[i], arg );
                        }
                    }else if( val.length < num ){
                        for( var i = 0, len = num - val.length; i < len; i++ ){
                            val.push( getAttr( attr ) );
                        }
                    }
                }else {
                    set[ attr ] = [];
                    //将crest: 2, 转换成crest: [2, 2, 2]
                    if( typeof val === 'number' || typeof val === 'boolean' ||
                        typeof val === 'string' ){
                        for( var i = 0; i < num; i++ ){
                            if( attr === 'offsetTop' || attr === 'crest' ){
                                val = scale( val, ch );
                            }else if( attr === 'offsetLeft' ){
                                val = scale( val, cw );
                            }else if( attr === 'rippleNum' ){
                                rippleLength.push( cw / val );
                            }
                            set[ attr ].push( val );
                        }
                    }
                }
            }

            function getAttr( attr ){
                switch ( attr ){
                    case 'color':
                        attr = randomColor();
                        break;
                    case 'lineWidth':
                        attr = limitRandom( 2, .2 );
                        break;
                    case 'offsetLeft':
                        attr = random() * cw;
                        break;
                    case 'offsetTop':
                    case 'crest':
                        attr = random() * ch;
                        break;
                    case 'rippleNum':
                        attr = limitRandom( cw / 2, 1 );
                        rippleLength.push( cw / attr );
                        break;
                    case 'speed':
                        attr = limitRandom( .4, .1 );
                        break;
                    case 'area':
                        attr = false;
                        break;
                    case 'stroke':
                        attr = true;
                        break;
                }
                return attr;
            }
            function scale( val, scale ){
                return val > 0 && val < 1 ? val * scale : val;
            }
        },
        createDot: function(){
            var set = this.set,
                cw = this.cw,
                lineNum = set.num,
                dots = [];

            for( var i = 0; i < lineNum; i++ ){

                var	line = [];
                //一个点的高度
                var step = pi2 / this.rippleLength[i];

                //创建一条线段所需的点
                for( var j = 0; j < cw; j++ ){
                    line.push({
                        x: j,
                        y: j * step
                    });
                }

                dots.push( line );

            }
            this.dots = dots;
        },
        draw: function(){
            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                set = this.set;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( lineDots, i ){
                cxt.save();
                cxt.beginPath();

                var crest = set.crest[i];
                var offsetLeft = set.offsetLeft[i];
                var offsetTop = set.offsetTop[i];
                var speed = set.speed[i];
                var color = set.color[i];
                lineDots.forEach(function( v, j ){
                    cxt[ j ? 'lineTo' : 'moveTo'](
                        v.x,
                        //y = A sin（ ωx + φ ）+ h
                        crest * sin( v.y + offsetLeft ) + offsetTop
                    );
                    v.y -= speed;
                });
                if( set.area[i] ){
                    cxt.lineTo( cw, ch );
                    cxt.lineTo( 0, ch );
                    cxt.closePath();
                    cxt.fillStyle = color;
                    cxt.fill();
                }
                if( set.stroke[i] ){
                    cxt.lineWidth = set.lineWidth[i];
                    cxt.strokeStyle = color;
                    cxt.stroke();
                }
                cxt.restore();
            });
            this.requestAnimationFrame();
        }
    };

    //继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );
    //添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;
}( window, Particleground );