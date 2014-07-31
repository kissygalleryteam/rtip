KISSY.use("kg/rtip/2.0.0/index,event,dom",function(S,RTip,E,D){

  RTip.listen(".J_RTip",{
    attrname:"data-title",
    alignConfig:{
      dirs:["top","bottom"]//优先看上下是否能放下tip
    }
  });

  RTip.listen(".J_show_tips",{
    alignConfig:{
      dirs:["top","bottom"]//优先看上下是否能放下tip
    }
  });

});
