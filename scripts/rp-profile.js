var body = {url: "https://www.themonster.xyz/src/home.html"}, loaded = false, loader;

function showRP() {
  if($("#background").html() != "") {
    
    return;
  } else {
    fetch("https://www.themonster.xyz/src/rp-profile.html")
    .then(res => {
      return res.text()
    })
    .then(text => {
      var cut = text.search("/script") + 8,
      html = text.slice(cut);

      $("#background").append(html);
      document.getElementById("exitProfile").onclick = function() {
        removeRP()
      }
    })
  }
  setTimeout(function(){
    $("#choose").fadeOut(200);
    $("#background").fadeIn(200);
  }, 200)
}

function removeRP() {
  $("#background").fadeOut(200);
}

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
  }).then(function(text) {
    var cut = text.search("/script") + 8,
    html = text.slice(cut);
    $("#content").html(html);
  });
}


$(document).ready(()=>{
  $("<div>", {
    id: "choose",
    html: `
      <div class="texture"></div>
      <div id="chooseProfile">
        <div class="choice__prof" id="coding">Coding Profile</div>
        <div class="choice__prof" id="rp">Character Profile</div>
      </div>
    `
  }).insertBefore("#loading");

  $("#coding.choice__prof").click(()=>{
    $("#choose").fadeOut(200);
    setTimeout(function(){
      $("#choose").remove();
    }, 200);
  });

  $("#rp.choice__prof").click(()=>{
    showRP();
    $("#chooseProfile").fadeOut(200);
    setTimeout(function(){
      $("#chooseProfile").remove();
    }, 200);
  })

  $("#showRP").click(()=>{
    showRP();
  })

  var content = $("#content"),
  currentTab = content.attr("open-tab");

  $("body").append($("<div />", {
    id: "tooltips"
  }));

  $("body").on("click", ".unset-style", function(){
    if(currentTab == $(this).attr("opens")) {
      return;
    }
    var elem = $(this),
    script = elem.attr("script");
    currentTab = elem.attr("opens");
    loaded = false;
    clearTimeout(loader);
    body = {
      url: `https://www.themonster.xyz/src/${currentTab}.html`,
      reqScript: script?`https://www.themonster.xyz/scripts/${script}.js`:null
    }

    $(`.scrollerWrap.body:not(#${currentTab})`).fadeOut(200);
    setTimeout(function(){
      $(`.scrollerWrap.body:not(#${currentTab})`).remove();
    }, 200);

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
});

$(window).on("load", ()=>{
  getData();
  endLoad();
});