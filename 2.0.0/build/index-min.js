/*! rtip - v2.0.0 - 2014-02.0.00 3:02:02 PM
* Copyright (c) 2014 yuanhuang; Licensed  */
KISSY.add("kg/rtip/2.0.0/anim",function(a,b){function c(b,c,h){function i(){t||(m=+new Date,x=!0)}function j(){var a=+new Date;w=w+a-m,x=!1}h||(h={}),h=a.merge(d,h);var k,l,m,n=+new Date,o=(n+h.duration,n),p=h.duration,q=e[h.easing],r=h.frame||a.noop,s={},t=!1,u=h.duration,v=0,w=0,x=!1;for(var y in b)c[y]||0==c[y]?s[y]=null:delete b[y];k=function(){var d,e;if(e=v/p,d=q(e),a.isArray(b))for(var g=0,i=b.length;i>g;g++)s[g]=b[g]+(c[g]-b[g])*d;else for(var j in b)s[j]=b[j]+(c[j]-b[j])*d;u>v?(r.call(z,s,e),l=f(k)):(r.call(z,c,1),t=!0,h.endframe&&h.endframe.call(z,c,1),z.fire("complete")),o=+new Date,v=o-n-w};var z={run:k,stop:function(){g(l)},resume:function(){x&&(j(),k())},pause:function(){x||(i(),g(l))},isRunning:function(){return!t}};return a.mix(z,a.EventTarget),0!=h.autoRun&&z.run(),z}var d,e=b.Easing,f=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){return setTimeout(a,16)},g=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||clearTimeout;return d={duration:1e3,easing:"easeNone"},c.AnimateObject=function(b,d){var e=[],f=0,g={},h={},i=b.length;a.each(b,function(a,b){var c,d=a.from,i=a.to;for(var j in d)c=f++,e[c]=[a,j,b],g[c]=d[j],h[c]=i[j]});var j=c(g,h,{easing:d.easing,duration:d.duration,autoRun:d.autoRun,frame:function(a){for(var b in a){var c=e,d=c[b][0],f=c[b][1],g=c[b][2],h=d.from;h[f]=a[b],d.frame&&d.frame(f,a[b],a,g,i)}},endframe:function(a){for(var b in a){var c=e,f=c[b][0],g=c[b][1],h=c[b][2];f.endframe&&f.endframe(g,a[b],h,a)}d.endframe&&d.endframe()}});return j},c},{requires:["anim"]}),KISSY.add("kg/rtip/2.0.0/index",function(a,b,c,d){function e(b){b=a.merge(w,b),o||(o=new c(v));var d=o.render(b);return a.Node(d)}function f(b,c,d,e,f){p||(p=a.Node("<div/>").css({visibility:"hidden",position:"fixed",left:"-9999em","max-width":e+"px",top:0}).appendTo(t)),p.append(b);var g={width:q.outerWidth(p),height:q.outerHeight(p)};return g.width>e?p.css("width",e):g.width<c?p.css("width",c):p.css("width","auto"),g.height<d?p.css("height",d):g.height>f&&p.css("height",f),g={width:q.outerWidth(p),height:q.outerHeight(p)},p.html(""),g}function g(b,c,d,e){var f,g=c.bbox,h=d.bbox,i=e.bbox;switch(b){case"top":var j=a.all(document).scrollTop()||0;f=g.top-j-i.height;break;case"right":f=h.width-g.left-g.width-i.width;break;case"bottom":var j=a.all(document).scrollTop()||0;f=h.height-(g.top-j)-g.height-i.height;break;case"left":f=g.left-h.left-i.width}return f>.01}function h(a,b,c,d){d||(d=[]);for(var e=0;e<d.length;e++)if(g(d[e],a,b,c))return d[e];var f;return f=i(a,b)}function i(b,c){var d=c.bbox,e=a.map(["top","right","bottom","left"],function(a){var c;switch(a){case"top":c={value:b.cy-d.top};break;case"right":c={value:d.width-b.cx};break;case"bottom":c={value:d.height-b.cy};break;case"left":c={value:b.cx-d.left}}return c.dir=a,c});return e.sort(function(a,b){return a.value>b.value?-1:a.value===b.value?0:1})[0].dir}function j(a,b,c,d,e,f,g){var h,i,j,k,l={},m=b.bbox,n=c.bbox,o=d.bbox,p=e.bbox;switch(a){case"top":case"bottom":l.x=b.cx,"top"==a?(l.y=b.cy-m.height/2,k=m.top+o.height-l.y):(l.y=b.cy+m.height/2+n.height,k=m.top+m.height-l.y),h=p.width>o.width?l.x-o.width*g:e.cx>l.cx?p.left+p.width-o.width:p.left,h<p.left?h=p.left:h+o.width>p.left+p.width&&(h=p.left+p.width-o.width),j=l.x-n.width/2,h>j?j=h:l.x+n.width/2>h+o.width&&(j=h+o.width-n.width/2),l.tx=h,l.ax=j-h,i="top"==a?l.y-o.height-n.height:l.y,l.ty=i,l.ay=k,l.tx=h-f[0],l.ty=i-f[1];break;case"right":case"left":l.x="right"==a?b.cx+m.width/2:b.cx-m.width/2,l.y=b.cy,"right"==a?(h=l.x+n.width,j=l.x):(h=l.x-o.width-n.width,j=l.x-n.width),i=p.height>o.height?l.y-o.height*g:e.cy>l.cy?p.height+p.top-o.height:p.top,i+o.height>p.top+p.height?i=p.top+p.height-o.height:i<p.top&&(i=p.top),l.tx=h+f[0],l.ty=i+f[1],k=l.y-n.height,i>k&&(k=i),l.ax=j-h,l.ay=k-i}return l}function k(a){for(var b,c=0;c<a.length;c++){b=a[c];var d=b.bbox;b.cx=d.left+d.width/2,b.cy=d.top+d.height/2}}function l(a){var b=new d.Defer,c=b.promise;return a.on("complete",function(){b.resolve()}),a.run(),c}function m(a,b){if(!b)return a;switch(b){case"top":a.ax-=4,a.ay-=4;break;case"bottom":a.ax-=4,a.ay+=2;break;case"right":a.ty+=1,a.ax+=1;break;case"left":a.ax-=4,a.ty+=1}return a}function n(b){b=a.merge(u,b);var c=a.Node('<div class="rtip-content"></div>');this.set("contentEl",c),c.appendTo(t),this.set(b)}var o,p,q=a.DOM,r=a.Event,s=window,t=(a.one(s),a.one(s.document.body)),u={tipArrowCls:"mui-chart-arrow-",tipContentCls:"mui-chart-tip-content",boundryDetect:!0,arrowsize:[6,6],maxwidth:!1,share:!1,autoAdjust:!1,autoRender:!1,autoAlignRate:300,offset:[0,0],tipPos:.5},v='<div class="mui-poptip mui-poptip-{{theme}}">                    <div class="mui-poptip-shadow">                        <div class="mui-poptip-container">                            <div class="mui-poptip-content" data-role="content">                                {{{content}}}                            </div>                        </div>                            <div class="mui-poptip-arrow {{#if dir}}mui-poptip-arrow-{{dir}}{{/if}}">                                <em></em>                                <span></span>                            </div>                    </div>                </div>',w={theme:"white"};a.extend(n,a.Base,{moveto:function(a,b){this.autoAlign({xy:!0,x:a,y:b})},autoAlign:function(a){this._autoAlign(a)},_autoAlign:function(c){c||(c={});var d="title"==this.get("__mode__");if((1!=this._hide||d)&&!this.isRunning()){this._isRunning=!0;var e=this,f=(this.get("target"),this.get("constrain"),this.get("tip"));if(this.get("arrow"),c.xy)this._setupXY(c.x,c.y);else if(!this._setupTarget())return;this._setupConstrain(),this._setupTip(),this._setupArrow(),k([this.get("target"),this.get("constrain")]);var g=this.get("target"),i=this.get("constrain"),n=this.get("tip"),o=this.get("arrow"),p=this.get("offset"),q=h(g,i,n,this.get("dirs")),r=j(q,g,this.get("arrow"),n,i,p,this.get("tipPos"));if(r=m(r,q),d||!this._previnfo||!a.equals(r,this._previnfo)){this._previnfo=r;var s={top:"b",right:"l",bottom:"t",left:"r"},t=this.get$tip({content:this.get("content"),dir:q,theme:this.get("theme")}),u=this.get$arrow(t),v=u.attr("class");if(v=v.replace(/mui-poptip-arrow-\w/g,""),v=a.trim(v),v+=" mui-poptip-arrow-"+s[q],u.attr("class",v),t.appendTo(this.get("contentEl")),f&&!d){t.css({position:"absolute"}),u.css({zIndex:1,display:"none"});var w=new b({width:f.bbox.width,height:f.bbox.height,tx:f.bbox.left,ty:f.bbox.top},{width:n.bbox.width,height:n.bbox.height,tx:r.tx,ty:r.ty},{duration:600,easing:"swing",autoRun:!1,frame:function(a){var b={};for(var c in a)"tx"==c?b.left=a[c]+"px":"ty"==c?b.top=a[c]+"px":"width"==c?b.width=a[c]+"px":"height"==c&&(b.height=a[c]+"px");t.css(b)}});l(w).then(function(){u.show();var a,c;a="left"==q?r.ax-o.bbox.width:"right"==q?r.ax+o.bbox.width:r.ax,c="top"==q?r.ay-o.bbox.height:"bottom"==q?r.ay+o.bbox.height:r.ay,l(new b({ax:a,ay:c},{ax:r.ax,ay:r.ay},{duration:300,easing:"swing",autoRun:!1,frame:function(a){var b={};for(var c in a)"ax"==c?b.left=a[c]+"px":"ay"==c&&(b.top=a[c]+"px");u.css(b)}})).then(function(){e._isRunning=!1,u.css({"z-index":21})})})}else{var x={position:"absolute",left:r.tx+"px",top:r.ty+"px"};x=a.merge(x,{width:n.bbox.width+"px",height:n.bbox.height+"px"}),t.css(x),u.css({left:r.ax+"px",top:r.ay+"px",zIndex:21}),e._isRunning=!1}n.bbox.left=r.tx,n.bbox.top=r.ty,this.set("$tip",t),this.set("$arrow",u),o.bbox.left=r.ax,o.bbox.top=r.ay}}},_setupXY:function(a,b){var c={bbox:{width:0,height:0,left:a,top:b}};this.set("target",c)},_setupTarget:function(){var b,c,d=this.get("align");if(!d||!(b=a.one(d)))return!1;var e=q.width(b),f=q.height(b),g=q.offset(b);return c={bbox:{width:e,height:f,left:g.left,top:g.top}},this.set("el",b),this.set("target",c),c},_setupConstrain:function(){var b,c=this.get("limit"),d={};if(c&&(b=a.one(c))){var e;e=q.offset(b),d={bbox:{width:q.width(b),height:q.height(b),left:e.left,top:e.top}}}else d={bbox:{left:0,top:0,width:q.width(s),height:q.height(s)}};return this.set("constrain",d),d},_setupTip:function(){var a,b,c,d,e=this.get("content"),f=this.get("minwidth"),g=this.get("maxwidth"),h=this.get("minheight"),i=this.get("maxheight");return a=this.getsizeof({content:e},f,h,g,i),c=f&&f>a.width?f:g&&g<a.width?g:a.width,d=h&&h>a.height?h:i&&i<a.height?i:a.height,b={bbox:{width:c,height:d}},this.set("tip",b),b},_setupArrow:function(){var a,b=this.get("arrowsize");return a={bbox:{width:b[0],height:b[1]}},this.set("arrow",a),a},getsizeof:function(a,b,c,d,e){return this.prevcontent&&this.prevcontent==a.content?this.tipsize:(this.tipsize=f(this.get$tip(a),b,c,d,e),this.prevcontent=a.content,this.tipsize)},get$tip:function(a){var b=this.get("$tip");return b&&b.remove(),b=e(a),this.set("$tip",b),b},get$arrow:function(a){return a||(a=this.gettip(this.getdata())),a.one(".mui-poptip-arrow")},isRunning:function(){return this._isRunning},show:function(){var a=this.get("$tip");a&&a.show(),this._hide=!1},hide:function(){var a=this.get("$tip");a&&a.hide(),this._hide=!0}});var x={maxwidth:300,__mode__:"title"};return n.listen=function(b,c){c||(c={});var d=a.all(b),e="binded",f=c.base||document,g=new n(a.merge(x,c.alignConfig));d=a.filter(d,function(a){return q.data(a,e)!=e});var h;r.delegate(f,"mouseenter",b,function(b){var d=c.attrname||"data-title",e=b.currentTarget,f=q.attr(e,d);a.trim(f)&&(h&&h.cancel&&h.cancel(),g.set("content",f),g.set("align",e),g.autoAlign())}),r.delegate(f,"mouseleave",b,function(){h=a.later(function(){g.hide()},100)}),g.get("contentEl").on("mouseenter",function(){h&&h.cancel&&h.cancel()}),g.get("contentEl").on("mouseleave",function(){g.hide()})},n.render=function(b,c,d){d||(d={});var b=a.all(b);if(b.length){d.content=c,d.align=b;var e,f=new n(a.merge(x,d));return r.on(b,"mouseenter",function(a){e&&e.cancel&&e.cancel(),a.preventDefault(),f.autoAlign(),f.show()}),r.on(b,"mouseleave",function(){e=a.later(function(){f.hide()},100)}),f.get("contentEl").on("mouseenter",function(){e&&e.cancel&&e.cancel()}),f.get("contentEl").on("mouseleave",function(){f.hide()}),f}},n},{requires:["./anim","./index.css","xtemplate","promise"]});