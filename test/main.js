var body = {url: "./src/home.html"}, loaded = false, loader;

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

function getData() {
  fetch(body.url)
  .then(function(response) {
    return response.text();
  }).then(function(string) {
    $("#content").html(string);
  });
}

$(document).ready(()=>{
  var content = $("#content"),
  currentTab = content.attr("open-tab");

  $("body").append($("<div />", {
    id: "tooltips"
  }));


  

  $(".headerBar .button, .logo.home").click(function(){
    if(currentTab == $(this).attr("opens")) {
      return;
    }
    var elem = $(this),
    script = elem.attr("script");
    currentTab = elem.attr("opens");
    loaded = false;
    body = {
      url: `./src/${currentTab}.html`,
      reqScript: script?`../scripts/${script}.js`:null
    }

    $(`.scrollerWrap.body:not(#${currentTab})`).fadeOut(200);
    setTimeout(function(){
      $(`.scrollerWrap.body:not(#${currentTab})`).remove();
    }, 200);

    function checkLoad() {
      if ( loaded ) {
        if($("body").find("#loading").length > 0) {
          endLoad();
        }
      } else if (!loaded) {
        if($("body").find("#loading").length == 0) {
          showLoading();
          console.log(currentTab);
        }
        loader = setTimeout(checkLoad, 100);
      };
    }

    setTimeout(function(){
      checkLoad();
    }, 2000);

    setTimeout(() => {
      getData();
      if(body.reqScript == null) {
        loaded = true;
      }
      setTimeout(()=>{
        if(body.reqScript != null) {
          $('body').append(function() {
            return $("<script>", {
              id: `${currentTab}-script`,
              src: body.reqScript
            });
          })
        } else {
          $("script[id*='-script']").remove();
        }
      }, 100);
    }, 200);

  });
});

$(document).ready(()=>{
  getData();
  endLoad();
});