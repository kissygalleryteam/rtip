/*
combined files : 

kg/rtip/2.0.0/anim
kg/rtip/2.0.0/index

*/
// -*- coding: utf-8; -*-
/**
 * @author yuanhuang.tjw@taobao.com
 * */
KISSY.add('kg/rtip/2.0.0/anim',function(S,Anim){
  var Easing = Anim.Easing
    , requestAnimFrame = window.requestAnimationFrame       ||
                         window.webkitRequestAnimationFrame ||
                         window.mozRequestAnimationFrame    ||
                         window.oRequestAnimationFrame      ||
                         window.msRequestAnimationFrame     ||
                         function (callback) {
                           return setTimeout(callback, 16);
                         }
    , cancelAnimationFrame = window.cancelAnimationFrame       ||
                             window.webkitCancelAnimationFrame ||
                             window.mozCancelAnimationFrame    ||
                             window.oCancelAnimationFrame      ||
                             window.msCancelAnimationFrame     ||
                             clearTimeout
    , dft
  dft = {
    duration:1000,
    easing:'easeNone'
  }
  function Animate(fromProps,toProps,opts){
    opts || (opts = {});
    opts = S.merge(dft,opts);

    var begin = +new Date
      , end = begin + opts.duration
      , now = begin
      , diff = opts.duration
      , fx = Easing[opts.easing]
      , frame = opts.frame || S.noop
      , props = {}
      , ended = false // 动画是否已经结束
      , run
      , _duration = opts.duration
      , timer

    // 用于resume的数据
    // |---a----|_b__|--c--|
    var a = 0
      , b = 0
      , stopTime
      , resumeable = false;

    // do some clean
    for(var x in fromProps){
      if(!toProps[x] && toProps[x] != 0){
        delete fromProps[x]
      }else{
        props[x] = null;
      }
    }

    run = function(){
      var s,t;
      t = a/diff
      s = fx(t)
      if(S.isArray(fromProps)){
        for(var i=0,len=fromProps.length;i<len;i++){
          props[i] = fromProps[i] + (toProps[i] - fromProps[i])*s;
        }
      }else{
        for(var x in fromProps){
          props[x] = fromProps[x] + (toProps[x] - fromProps[x])*s;
        }
      }
      if(a<_duration){
        frame.call(api,props,t);
        timer = requestAnimFrame(run);
      }else{
        frame.call(api,toProps,1);
        ended = true;
        if(opts.endframe){
          opts.endframe.call(api,toProps,1);
        }
        api.fire("complete");
      }
      now = +new Date;
      a = now - begin - b;
    }
    function saveFrame(){
      if(!ended){
        stopTime = +new Date;
        resumeable = true;
      }
    }
    function restoreFrame(){
      var _now = +new Date;
      b = b + _now  - stopTime;
      resumeable = false;
    }
    var api =  {
      run:run,
      stop:function(){
        cancelAnimationFrame(timer);
      },
      resume:function(){
        if(resumeable){
          restoreFrame();
          run();
        }
      },
      pause:function(){
        if(!resumeable){
          saveFrame();
          cancelAnimationFrame(timer);
        }
      },
      isRunning:function(){
        return !ended;
      }
    }
    S.mix(api,S.EventTarget);
    if(opts.autoRun != false){
      api.run();
    }
    return api;
  }
  Animate.AnimateObject = function (props,cfg){
    var AnimMap = []
      , AnimMapIndex = 0

    var from = {}
      , to = {}
      , len = props.length
    S.each(props,function(p,index){
      var f = p.from
        , t = p.to
        , key
      for(var x in f){
        key = AnimMapIndex++
        AnimMap[key] = [p,x,index]
        from[key] = f[x]
        to[key] = t[x]
      }
    });
    var anim = Animate(from,to,{
      easing:cfg.easing,
      duration:cfg.duration,
      autoRun:cfg.autoRun,
      frame:function(props,t){
        for(var x in props){
          var map = AnimMap
            , p = map[x][0]
            , attrname = map[x][1]
            , index = map[x][2]
            , from = p.from
          from[attrname] = props[x];
          p.frame && p.frame(attrname,props[x],props,index,len);
        }
      },
      endframe:function(props,t){
        for(var x in props){
          var map = AnimMap
            , p = map[x][0]
            , attrname = map[x][1]
            , index = map[x][2]
          p.endframe && p.endframe(attrname,props[x],index,props);
        }
        cfg.endframe && cfg.endframe();
      }
    })
    return anim;
  }
  return Animate;
},{
  requires:['anim']
})

/**
 * @author:元晃
 * */
KISSY.add('kg/rtip/2.0.0/index',function(S,Anim,XTemplate,Promise){
  var D = S.DOM
    , E = S.Event
    , win = window
    , $win = S.one(win)
    , $body = S.one(win.document.body);

  var defaultCfg = {
    tipArrowCls:'mui-chart-arrow-',        // tip箭头方向
    tipContentCls:'mui-chart-tip-content', // tip内容
    boundryDetect:true,                    // 默认开启边界检测
    arrowsize:[6,6],
    maxwidth:false,                        // 最大宽度，超过这个宽度折行
    share:false,                           // 共用tip
    autoAdjust:false,                      // 窗口变化自动调整位置
    autoRender:false,                      // 自动渲染，必须设置了x,y
    autoAlignRate:300,
    offset:[0,0],
    tipPos: 0.5             // tip position, (0, 1)
  };

    var TIPTPL = '<div class="mui-poptip mui-poptip-{{theme}}">\
                    <div class="mui-poptip-shadow">\
                        <div class="mui-poptip-container">\
                            <div class="mui-poptip-content" data-role="content">\
                                {{{content}}}\
                            </div>\
                        </div>\
                            <div class="mui-poptip-arrow {{#if dir}}mui-poptip-arrow-{{dir}}{{/if}}">\
                                <em></em>\
                                <span></span>\
                            </div>\
                    </div>\
                </div>';
  // default align
  // var align = {
  //   offset:[0,0]
  // };
  var $shareTip
    , xtemplate
    , themecfg = {
      theme:"white"
    }

  function createTip(data){
    data = S.merge(themecfg,data);
    if(!xtemplate){
      xtemplate = new XTemplate(TIPTPL)
    }
    var HTML = xtemplate.render(data);
    return S.Node(HTML);
  }

  //获取tip content的尺寸
  var $detector
  function sizeof(html,minwidth,minheight,maxwidth,maxheight){
    $detector || ($detector = S.Node("<div/>").css({
      "visibility":"hidden",
      "position":"fixed",
      "left":'-9999em',
      'max-width': maxwidth + 'px',
      "top":0
    }).appendTo($body));
    $detector.append(html);
    var ret = {
      width:D.outerWidth($detector),
      height:D.outerHeight($detector)
    }
    if(ret.width > maxwidth){
      $detector.css("width",maxwidth);
    }else if(ret.width < minwidth){
      $detector.css("width",minwidth);
    } else {
      $detector.css("width", 'auto');
    }

    if(ret.height < minheight){
      $detector.css("height",minheight);
    }else if(ret.height > maxheight){
      $detector.css("height",maxheight);
    }

    ret = {
      width:D.outerWidth($detector),
      height:D.outerHeight($detector)
    }

    $detector.html("");
    return ret;
  }

  //tip放置在某个位置是否合适
  function isProperDirection(dir,target,constrain,tip){
    var tbbox = target.bbox
      , cbbox = constrain.bbox
      , bbox = tip.bbox

    var edge;
    switch(dir){
      case "top":
      var scrollTop = S.all(document).scrollTop() || 0;
      edge = (tbbox.top - scrollTop) - bbox.height;
      break;
      case "right":
      edge =  cbbox.width - tbbox.left - tbbox.width - bbox.width;
      break;
      case "bottom":
      var scrollTop = S.all(document).scrollTop() || 0;
      edge = cbbox.height - (tbbox.top - scrollTop) - tbbox.height - bbox.height;
      break;
      case "left":
      edge = tbbox.left - cbbox.left - bbox.width;
      break;
    }
    return edge > 0.01;
  }

  //给tip选择一个合适的摆放位置
  function chooseProperDirection(target,constrain,tip,candinate){
    candinate || (candinate = []);
    for(var i=0;i<candinate.length;i++){
      if(isProperDirection(candinate[i],target,constrain,tip)){
        return candinate[i];
        break;
      }
    }
    var ret;
    //target in constrain
    ret = findBestDirction(target,constrain);
    return ret;
  }

  //寻找最合适的tip方向
  function findBestDirction(target,constrain){
    var cbbox = constrain.bbox;
    var dirs = S.map(["top","right","bottom","left"],function(dir){
                 var ret;
                 switch(dir){
                   case "top":
                   ret = {value:target.cy - cbbox.top};
                   break;
                   case "right":
                   ret = {value:cbbox.width - target.cx};
                   break;
                   case "bottom":
                   ret = {value:cbbox.height - target.cy};
                   break;
                   case "left":
                   ret = {value:target.cx - cbbox.left};
                   break;
                 }
                 ret.dir = dir;
                 return ret;
               });
    return dirs.sort(function(a,b){
             return a.value > b.value ? -1 : a.value === b.value ? 0 : 1;
           })[0]['dir'];
  };

  //获取tip尖角的位置，以及tipbox的左上角的坐标
  function getTipBoxAndArrowXY(dir,target,arrow,tip,constrain,offset, pos){
    var ret = {}
      , targetBBox = target.bbox
      , arrowBBox = arrow.bbox
      , tbbox = tip.bbox
      , cbbox = constrain.bbox

    var tx,ty;//tip box (x,y)
    var ax,ay;//arrow box (x,y)
    switch(dir){
      case "top":
      case "bottom":
      ret.x = target.cx;
      if(dir == "top"){
        ret.y = target.cy - targetBBox.height/2;
        ay = targetBBox.top + tbbox.height - ret.y;
      }else{
        ret.y = target.cy + targetBBox.height/2 + arrowBBox.height;
        ay = targetBBox.top + targetBBox.height - ret.y;
      }
      //如果能放下tip
      if(cbbox.width > tbbox.width){
        tx = ret.x - tbbox.width * pos;
      }else{                     //不能放下，取露出来最多的
        if(constrain.cx>ret.cx){ //右边对齐
          tx = cbbox.left + cbbox.width - tbbox.width;
        }else{                   //左边对齐
          tx = cbbox.left;
        }
      }

      if(tx < cbbox.left){                                   //超过左边界了
        tx = cbbox.left;
      }else if(tx + tbbox.width > cbbox.left + cbbox.width){ //超越右边界了
        tx = cbbox.left+cbbox.width - tbbox.width;
      }

      //尖角
      ax = ret.x - arrowBBox.width/2;

      if(ax < tx){
        ax = tx;
      }else if(ret.x+arrowBBox.width/2 > tx+tbbox.width){
        ax = tx+tbbox.width - arrowBBox.width/2;
      }

      ret.tx = tx;
      ret.ax = ax - tx;
      //ty
      if(dir == "top"){
        ty = ret.y - tbbox.height - arrowBBox.height;
      }else{
        ty = ret.y;
      }

      ret.ty = ty;
      ret.ay = ay;

      ret.tx = tx - offset[0];
      ret.ty = ty - offset[1];

      break;
      case "right":
      case "left":
      if(dir == "right"){
        ret.x = target.cx + targetBBox.width/2;
      }else{
        ret.x = target.cx - targetBBox.width/2;
      }
      ret.y = target.cy;

      if(dir == "right"){
        tx = ret.x+arrowBBox.width;
        ax = ret.x;
      }else{
        tx = ret.x - tbbox.width - arrowBBox.width;
        ax = ret.x - arrowBBox.width;
      }
      //能放下tip
      if(cbbox.height > tbbox.height){
        ty = ret.y - tbbox.height * pos;
      }else{
        if(constrain.cy > ret.cy){//偏下放置
          ty = cbbox.height + cbbox.top - tbbox.height;
        }else{
          ty = cbbox.top;
        }
      }

      if(ty + tbbox.height > cbbox.top + cbbox.height){//超过下边界了，会出现滚动条，要避免
        ty = cbbox.top + cbbox.height - tbbox.height;
      }else if(ty<cbbox.top){//越过上边界了
        ty = cbbox.top;
      }

      ret.tx = tx + offset[0];
      ret.ty = ty + offset[1];

      ay = ret.y - arrowBBox.height;
      if(ay<ty){
        ay = ty;
      }
      ret.ax = ax - tx;
      ret.ay = ay - ty;

      break;
    }
    return ret;
  }

  //依据o的bbox增加o.cx o.cy
  function fillTargetWithExtraField(os){
    var o;
    for(var i=0;i<os.length;i++){
      o = os[i];
      var bbox = o.bbox
      o.cx = bbox.left + bbox.width/2;
      o.cy = bbox.top + bbox.height/2;
    }
  }

  function promiseAnim(anim){
    var defer = new Promise.Defer()
      , promise = defer.promise
    anim.on("complete",function(){
      defer.resolve()
    });
    anim.run();
    return promise;
  }

  function fixinfo(info,dir){
    if(!dir)return info;
    var ret;
    switch(dir){
      case "top":
      info.ax -= 4;//
      info.ay -= 4;//
      break;
      case "bottom":
      info.ax -= 4;//
      info.ay += 2;
      break;
      case "right":
      info.ty+=1;//阴影的原因
      info.ax+=1;
      break;
      case "left":
      info.ax-=4;
      info.ty+=1;//阴影的原因，下移1px
      break;
    }
    return info;
  }

  function Tip(cfg){
    cfg = S.merge(defaultCfg,cfg);
    var box = S.Node('<div class="rtip-content"></div>');
    this.set('contentEl', box);
    box.appendTo($body);
    this.set(cfg);
  };

  S.extend(Tip,S.Base,{
    moveto:function(x,y){
      this.autoAlign({xy:true,x:x,y:y});
    },
    autoAlign:function(config){
      var that = this;
      //var align = S.buffer(function(config){
                    //that._autoAlign(config);
                  //},this.get("autoAlignRate"));
      this._autoAlign(config);
      //this.autoAlign = align;
    },
    _autoAlign:function(config){
      config || (config = {});
      var titleMode = this.get("__mode__") == "title";

      if(this._hide == true){
        if(!titleMode){
          return;
        }
      }
      if(this.isRunning()){
        return;
      }

      this._isRunning = true;

      var that = this;

      // prev info
      var target0 = this.get("target")
        , constrain0 = this.get("constrain")
        , tip0 = this.get("tip")
        , arrow0 = this.get("arrow")

      //设置target
      if(config.xy){
        this._setupXY(config.x,config.y);
      }else{
        if(!this._setupTarget()){
          return;
        }
      }
      //设置constrain
      this._setupConstrain();

      //设置tip
      this._setupTip();

      //设置arrow
      this._setupArrow();

      //添加cx cy
      fillTargetWithExtraField([this.get("target"),this.get("constrain")]);

      var target = this.get("target")
        , constrain = this.get("constrain")
        , tip = this.get("tip")
        , arrow = this.get("arrow")

      var offset = this.get("offset")

      var dir = chooseProperDirection(target,
                                      constrain,
                                      tip,
                                      this.get("dirs"));
      var info = getTipBoxAndArrowXY(dir,
                                     target,
                                     this.get("arrow"),
                                     tip,
                                     constrain,
                                     offset, this.get('tipPos'));
      //各个方向上的位移修正
      info = fixinfo(info,dir);
      //title模式，并且位置信息没有变化的话，不重新渲染
      if(!titleMode && this._previnfo && S.equals(info,this._previnfo)){
        return;
      }
      this._previnfo = info;
      var diro = {
          "top":"b",
          "right":"l",
          "bottom":"t",
          "left":"r"
      }

      var $tip = this.get$tip({
        content: this.get("content"),
        dir: dir,
        theme: this.get('theme')
      });
      var $arrow = this.get$arrow($tip)

      var clsname = $arrow.attr("class")
      clsname = clsname.replace(/mui-poptip-arrow-\w/g,"");
      clsname = S.trim(clsname);
      clsname += " mui-poptip-arrow-"+diro[dir];
      $arrow.attr("class",clsname);

      $tip.appendTo(this.get('contentEl'));

      if(tip0 && !titleMode){
        $tip.css({
          position:"absolute"
        });
        $arrow.css({
          zIndex:1,
          display:"none"
        });
        var anim = new Anim({
          width:tip0.bbox.width,
          height:tip0.bbox.height,
          tx:tip0.bbox.left,
          ty:tip0.bbox.top
        },{
          width:tip.bbox.width,
          height:tip.bbox.height,
          tx:info.tx,
          ty:info.ty
        },{
          duration:600,
          easing:"swing",
          autoRun:false,
          frame:function(toProps,percent){
            var attr1 = {};
            for(var x in toProps){
              if(x == "tx"){
                attr1.left = toProps[x]+"px"
              }else if(x == "ty"){
                attr1.top = toProps[x]+"px"
              }else if(x == "width"){
                attr1.width = toProps[x]+'px';
              }else if(x == "height"){
                attr1.height = toProps[x]+'px';
              }
            }
            $tip.css(attr1);
          }
        });
        promiseAnim(anim)
        .then(function(){
          $arrow.show();
          var ax0, ay0;
          if(dir == "left"){
            ax0 = info.ax - arrow.bbox.width
          }else if(dir == "right"){
            ax0 = info.ax + arrow.bbox.width
          }else{
            ax0 = info.ax;
          }
          if(dir == "top"){
            ay0 = info.ay - arrow.bbox.height;
          }else if(dir == "bottom"){
            ay0 = info.ay + arrow.bbox.height;
          }else{
            ay0 = info.ay;
          }
          promiseAnim(new Anim({
            ax:ax0,
            ay:ay0
          },{
            ax:info.ax,
            ay:info.ay
          },{
            duration:300,
            easing:"swing",
            autoRun:false,
            frame:function(toProps,percent){
              var attr = {};
              for(var x in toProps){
                if(x == "ax"){
                  attr.left = toProps[x]+"px"
                }else if(x == "ay"){
                  attr.top = toProps[x]+"px"
                }
              }
              $arrow.css(attr);;
            }
          }))
          .then(function(){
            that._isRunning = false;
            $arrow.css({"z-index":21});
          });
        })
      }else{
        var tipcss = {
            position:"absolute",
            left:info.tx+"px",
            top:info.ty+"px"
          }
        // if(!titleMode){
          tipcss = S.merge(tipcss,{
            width:tip.bbox.width+"px",
            height:tip.bbox.height+"px"
          });
        // }
        $tip.css(tipcss);
        $arrow.css({
          left:info.ax+"px",
          top:info.ay+"px",
          zIndex:21
        });
        that._isRunning = false;
      }

      tip.bbox.left = info.tx
      tip.bbox.top = info.ty;

      this.set("$tip",$tip);
      this.set("$arrow",$arrow);

      arrow.bbox.left = info.ax;
      arrow.bbox.top = info.ay;
    },
    _setupXY:function(x,y){
      var target = {
        bbox:{
          width:0,
          height:0,
          left:x,
          top:y
        }
      }
      this.set("target",target);
    },
    _setupTarget:function(){
      var t = this.get("align")
        , el
        , target
      if(t && (el = S.one(t))){
        var w = D.width(el)
          , h = D.height(el)
          , offset = D.offset(el)
        target = {
          bbox:{
            width:w,
            height:h,
            left:offset.left,
            top:offset.top
          }
        }
        this.set("el",el);
        this.set("target",target);
      }else{
        return false;
      }
      return target;
    },
    _setupConstrain:function(){
      var c = this.get("limit")
        , el
        , constrain = {}
      if(c && (el = S.one(c))){
        var offset
        offset = D.offset(el)
        constrain = {
          bbox:{
            width:D.width(el),
            height:D.height(el),
            left:offset.left,
            top:offset.top
          }
        };
      }else{
        constrain = {
          bbox:{
            left:0,
            top:0,
            width:D.width(win),
            height:D.height(win)
          }
        }
      }
      this.set("constrain",constrain);
      return constrain;
    },
    _setupTip:function(){
      var content = this.get("content")
        , size
        , tip
        , width
        , height
        , minwidth = this.get("minwidth")
        , maxwidth = this.get("maxwidth")
        , minheight = this.get("minheight")
        , maxheight = this.get("maxheight")

      size = this.getsizeof({content:content},minwidth,minheight,maxwidth,maxheight);
      if(minwidth && minwidth>size.width){
        width = minwidth;
      }else if(maxwidth && maxwidth < size.width){
        width = maxwidth;
      }else{
        width = size.width;
      }

      if(minheight && minheight>size.height){
        height = minheight;
      }else if(maxheight && maxheight < size.height){
        height = maxheight;
      }else{
        height = size.height;
      }
      tip = {
        bbox:{
          width:width,
          height:height
        }
      }
      this.set("tip",tip);
      return tip;
    },
    _setupArrow:function(){
      var arrow
        , arrowsize = this.get("arrowsize")
      arrow = {
        bbox:{
          width:arrowsize[0],
          height:arrowsize[1]
        }
      };
      this.set("arrow",arrow)
      return arrow;
    },
    //做了一层缓存
    getsizeof:function(o,minwidth,minheight,maxwidth,maxheight){
      if(this.prevcontent && this.prevcontent == o.content){
        return this.tipsize;
      }else{
        this.tipsize = sizeof(this.get$tip(o),minwidth,minheight,maxwidth,maxheight);
      }
      this.prevcontent = o.content;
      return this.tipsize;
    },
    get$tip:function(data){
      var $tip = this.get("$tip")
      if($tip){
        $tip.remove();
      }
      $tip = createTip(data);
      this.set("$tip",$tip);
      return $tip;
    },
    get$arrow:function($con){
      $con || ($con = this.gettip(this.getdata()));
      return $con.one(".mui-poptip-arrow");
    },
    isRunning:function(){
      return this._isRunning;
    },
    show:function(){
      var el = this.get("$tip")
      el && el.show();
      this._hide = false;
    },
    hide:function(){
      var el = this.get("$tip")
      el && el.hide();
      this._hide = true;
    }
  });
  var listenDft = {
    maxwidth:300,
    "__mode__":"title"
  };

  Tip.listen = function(selector, opt){

    opt || (opt = {});

    var els = S.all(selector);
    var BINDED = "binded";
    var delegate = opt.base || document;

    var tip = new Tip(S.merge(listenDft,opt.alignConfig));
    els = S.filter(els,function(el){
      return D.data(el,BINDED) != BINDED;
    });
    var timmer;

    E.delegate(delegate, 'mouseenter', selector, function(e){

      var attrname = opt.attrname || "data-title"
      var el = e.currentTarget
        , title = D.attr(el,attrname)

      if(S.trim(title)){
        timmer && timmer.cancel && timmer.cancel();
        tip.set("content",title);
        tip.set("align",el);
        tip.autoAlign();
      }

    });

    E.delegate(delegate, 'mouseleave', selector, function(e){
      timmer = S.later(function(){
        tip.hide();
      }, 100);
    });

    tip.get('contentEl').on('mouseenter', function(){
      timmer && timmer.cancel && timmer.cancel();
    });

    tip.get('contentEl').on('mouseleave', function(){
      tip.hide();
    });

  }

  Tip.render = function(el, content, opt){
    opt || (opt = {});
    var el = S.all(el);

    if(el.length){

      opt.content = content;
      opt.align = el;
      var tip = new Tip(S.merge(listenDft, opt));
      var timmer;

      E.on(el,"mouseenter",function(e){

        timmer && timmer.cancel && timmer.cancel();
        e.preventDefault();
        tip.autoAlign();
        tip.show();

      });

      E.on(el,"mouseleave",function(){

        timmer = S.later(function(){
          tip.hide();
        }, 100);

      })

      tip.get('contentEl').on('mouseenter', function(){
        timmer && timmer.cancel && timmer.cancel();
      });

      tip.get('contentEl').on('mouseleave', function(){
        tip.hide();
      });

      return tip;
    }
  };
  return Tip;
},{requires:['./anim',
             "./index.css",
             "xtemplate",
             "promise"]});

