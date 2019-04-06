$(window).on("load", ()=>{
    $("#loading").fadeOut(1000);
    
    setTimeout(function(){
      $("#loading").remove();
    }, 1500);
});

$(document).ready(()=>{
  $(".unset-style, .button:not(a)").click(function(){
    var opens = `#${$(this).attr("opens")}`;
    if($(opens).is(":visible")) {
      return;
    }

    $(".scrollerWrap.body").fadeOut(200);
    setTimeout(function(){
      $(opens).fadeIn(200);
      $(opens).addClass("open");
    }, 200);
  });
});