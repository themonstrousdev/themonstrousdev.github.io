var body = {url: "./src/home.html", title: document.title}, loaded = false, loader, prevPage = [], prevScript = [], content = $("#content"),
currentTab = content.attr("open-tab"), orient, momentjs = document.createElement("script"),date = new Date(), currentYear = date.getFullYear(), prevHeads = [];

$.getScript('./scripts/libs/swiped-events-master/src/swiped-events.js', function() {
  logSuccess("Injected swipe detector");
});

momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment-with-locales.min.js";

document.head.appendChild(momentjs)

function orientchange(e) {
  var menu = $("#header .logo.home");
  orient = window.screen.orientation.type.includes("landscape") ? "landscape" : "portrait";
  if(orient == "portrait") {
    var detach = $("#header").detach();
    detach.insertBefore("#content+*");
    menu.hasClass("menu") ? null : menu.addClass("menu");
    if($(".button[opens=home]").length == 0) {
      $("<div>", {
        class: "unset-style button",
        opens: "home",
        html: "Home"
      }).prependTo("#header .headerBar");
    }
  } else if (orient == "landscape") {
    var detach = $("#header").detach();
    detach.insertBefore("#content");
    menu.hasClass("menu") ? menu.removeClass("menu") : null
    $(".headerBar .button[opens=home]").remove();
  } else {
    logError("Unknown orientation type");
  }
}

$(window).resize(()=>{
  orientchange();
})

orientchange();

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
      document.title = body.title;
    }
    $("#content").html(html);
  });
}

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

$("#footer #copy").html(`Copyrighted &copy; ${currentYear}, Monster Dev`);

$("body").append($("<div />", {
  id: "tooltips"
}));

function closeMenu() {
  if(!$("#header").hasClass("open")) {
    return;
  }

  $("#header").removeClass("open");
  $("#headerExit").fadeOut(500);

  setTimeout(() => {
    $("#headerExit").remove();
  }, 1000);
}

function openMenu() {
  if($("#header").hasClass("open")) {
    return;
  }

  $("#header").addClass("open");
  $("<div>", {
    id: "headerExit",
    click: function() {
      closeMenu();
    }
  }).insertBefore("#header");
}

$("body").on("click", ".unset-style.menu", function(){
  openMenu();
});

$(window).on("swiped-left", ()=>{
  closeMenu();
  return false;
});

$(window).on("swiped-right", ()=>{
  openMenu();
  return false;
});

$("body").on("click", ".unset-style:not(.menu)", function(){
  if($("#header").hasClass("open")) {
    $("#header").removeClass("open");
    $("#headerExit").fadeOut(500);

    setTimeout(() => {
      $("#headerExit").remove();
    }, 1000);
  }

  if(currentTab == $(this).attr("opens") || !$(this).attr("opens")) {
    return;
  }

  var elem = $(this),
  script = elem.attr("script"),
  url = window.location.href,
  lastSlash = url.includes("/") ? url.lastIndexOf("/") : null;

  lastSlash && lastSlash != url.length - 1 ? prevPage.push(url.slice(lastSlash + 1)) : prevPage.push("home");
  prevScript.push(body.reqScript);
  prevHeads.push(body.title);

  currentTab = elem.attr("opens");
  header = elem.attr("head");
  loaded = false;
  clearTimeout(loader);
  body = {
    url: `./src/${currentTab}.html`,
    reqScript: script?`./scripts/${script}.js`:null,
    title: header
  }

  $(`.scrollerWrap.body:not(#${currentTab})`).fadeOut(200);
  setTimeout(function(){
    $(`.scrollerWrap.body:not(#${currentTab})`).remove();
  }, 200);

  setTimeout(() => {
    getData(currentTab);
  }, 300);

  loader = setTimeout(() => {
    checkLoad();
  }, 2000);

});

$(document).ready(()=>{
  getData($("#content").attr("open-tab"));
  setTimeout(checkLoad, 100);
});

$(window).on("popstate", function(e) {
  if(prevPage.length > 0) {
    currentTab = prevPage[prevPage.length - 1];
    loaded = false;
    clearTimeout(loader);
    body = {
      url: `./src/${currentTab}.html`,
      reqScript: prevScript[prevScript.length - 1],
      title: prevHeads[prevHeads.length - 1]
    }

    $(`.scrollerWrap.body:not(#${currentTab})`).fadeOut(200);
    setTimeout(function(){
      $(`.scrollerWrap.body:not(#${currentTab})`).remove();
    }, 200);

    setTimeout(() => {
      getData(currentTab);
    }, 300);

    loader = setTimeout(() => {
      checkLoad();
    }, 2000);

    prevPage.pop();
    prevScript.pop();
    prevHead.pop();
  } else {
    window.history.back();
  }
})