var body = {url: "./src/home.html"}, loaded = false, loader, prevPage = [], prevScript = [], content = $("#content"),
currentTab = content.attr("open-tab");

var momentjs = document.createElement("script");
momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment-with-locales.min.js";
document.head.appendChild(momentjs)

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

function getData(tab) {
  fetch(body.url)
  .then(function(response) {
    return response.text();
  }).then(function(text) {
    var cut = text.search("/script") + 8,
    html = text.slice(cut);
    if(body.reqScript == null) {
      loaded = true;
    }

    setTimeout(()=>{
      if(body.reqScript != null) {
        $('body').append(function() {
          return $("<script>", {
            id: `${tab}-script`,
            src: body.reqScript
          });
        })
      } else {
        $("script[id*='-script']").remove();
      }
    }, 100);

    if(tab) {
      history.pushState("", "", `${tab != "home"?tab:"/"}`)
    }
    $("#content").html(html);
  });
}

$("body").append($("<div />", {
  id: "tooltips"
}));

$("body").on("click", ".unset-style", function(){
  if(currentTab == $(this).attr("opens")) {
    return;
  }
  var elem = $(this),
  script = elem.attr("script"),
  url = window.location.href,
  lastSlash = url.includes("/") ? url.lastIndexOf("/") : null;

  lastSlash && lastSlash != url.length - 1 ? prevPage.push(url.slice(lastSlash + 1)) : prevPage.push("home");
  prevScript.push(body.reqScript);

  currentTab = elem.attr("opens");
  loaded = false;
  clearTimeout(loader);
  body = {
    url: `./src/${currentTab}.html`,
    reqScript: script?`./scripts/${script}.js`:null
  }

  $(`.scrollerWrap.body:not(#${currentTab})`).fadeOut(200);
  setTimeout(function(){
    $(`.scrollerWrap.body:not(#${currentTab})`).remove();
  }, 200);

  setTimeout(() => {
    getData(currentTab);
  }, 300);

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
      setTimeout(checkLoad, 100);
    };
  }

  loader = setTimeout(() => {
    checkLoad();
  }, 2000);

});

$(window).on("load", ()=>{
  getData($("#content").attr("open-tab"));
  endLoad();
});

$(window).on("popstate", function(e) {
  if(prevPage.length > 0) {
    currentTab = prevPage[prevPage.length - 1];
    loaded = false;
    clearTimeout(loader);
    body = {
      url: `./src/${currentTab}.html`,
      reqScript: prevScript[prevScript.length - 1]
    }

    $(`.scrollerWrap.body:not(#${currentTab})`).fadeOut(200);
    setTimeout(function(){
      $(`.scrollerWrap.body:not(#${currentTab})`).remove();
    }, 200);

    setTimeout(() => {
      getData(currentTab);
    }, 300);

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
        setTimeout(checkLoad, 100);
      };
    }

    loader = setTimeout(() => {
      checkLoad();
    }, 2000);

    prevPage.pop();
    prevScript.pop();
  } else {
    window.history.back();
  }
})