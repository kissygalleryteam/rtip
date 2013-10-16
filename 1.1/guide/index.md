## 综述

RTip is a smart tip

- Version 1.1
- Author 元晃
- Contributors 翰文
- Require KISSY 1.3+
- Support ie6+

## 快速使用

引入kissy seed
```html
<script src="http://a.tbcdn.cn/??s/kissy/1.3.0/seed-min.js"></script>
```

### 使用方式一：作为title的替代品

这种模式适用与一堆tip需要展示，通过tip的trigger上一个dom属性来配置tip弹出内容。
这种模式下，trigger的事件通过代理实现的，初十话一个Rtip实例，mouseenter到trigger
上时，修改tip的html内容和位置。

因为是通过事件代理实现的，所以trigger本身的dom结构可以从无到有的改变。

```js
KISSY.use('gallery/rtip/1.1/index', function (S, RTip) {
    RTip.listen(".J_RTips")
})
```

### 使用方式二：初始化单个复杂html内容的tip

上面模式下，需要在trigger的dom中绑定tip内容，这样一般内容只能是比较简单的情况。
如果复杂的html结构，绑定到dom中需要escapeHTML过程，有点麻烦。通常复杂的模板放在
一个script标签中。

```js
KISSY.use('gallery/rtip/1.1/index', function(){
    RTip.render(el, content, opt);
})
```

### 使用方式三：RTip实例使用

这种方式使用起来比较麻烦，可以参考源码使用。

```js
S.use('gallery/rtip/1.1/index', function (S, RTip) {
     var tip = new RTip({
     });
})
```

<hr class="smooth large" />

## API说明

*RTip.listen* 和 *RTip.render* 对RTip就行了一定的封装。

    tipArrowCls:'mui-chart-arrow-',        // tip箭头方向
    tipContentCls:'mui-chart-tip-content', // tip内容
    boundryDetect:true,                    // 默认开启边界检测
    arrowsize:[6,6],
    maxwidth: 300,                        // 最大宽度，超过这个宽度折行
    autoAdjust:false,                      // 窗口变化自动调整位置
    autoRender:false,                      // 自动渲染，必须设置了x,y
    offset:[0,0],
    dirs: ['left', 'right'],
    tipPos: 0.5  // 箭头位置，0 到 1，表示相对于盒子宽度或者高度的百分比
