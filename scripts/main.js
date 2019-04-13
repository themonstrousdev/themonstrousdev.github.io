function logError(text) {
  console.log("%c[ERROR]: %c" + text, "color: red; font-weight: bold;font-family: monospace", "color: black; font-family: monospace");
}

function logSuccess(text) {
  console.log("%c[SUCCESS]: %c"+text, "color: green; font-weight: bold; font-family: monospace", "color:black; font-family: monospace");
}

function logPending(text) {
  console.log("%c[PROCESSING]: %c"+text, "color: yellow; font-weight: bold; font-family: monospace", "color:black; font-family: monospace");
}

function showLoading() {
  $("#content").append(`
  <div id="loading">
    <div class="texture"></div>
    <div id="load"></div>
    <div id="message">. . . Loading Content. . .</div>
  </div>
  `);
};

function endLoad() {
  $("#loading").fadeOut(200);

  setTimeout(function(){
    $("#loading").remove();
  }, 200);
}

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