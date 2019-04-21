
var curIndex, images, imageLoaded = false, showCode = false;

function showImage() {
  $("#gallOverlay #load").fadeOut(200);
  $("#gallOverlay #message").fadeOut(200);
  setTimeout(() => {
    if($("#gallOverlay #load") && $("#gallOverlay #message")) {
      $("#gallOverlay #load").remove();
      $("#gallOverlay #message").remove();
    }
  $("#gallOverlay img").fadeIn(200);
  }, 200);
}

function imgLoader() {
  if(!imageLoaded && $("#gallOverlay").find("#load").length == 0 && $("#gallOverlay").find("#message").length == 0) {
    $("<div>", {
      id: "load",
      style: "border: none;transform:translate(-50%, -50%)"
    }).insertBefore("#gallOverlay .next");
    
    readyImg();

    $("<div>", {
      id: "message",
      class: "show-image",
      html: "Image Loading<br>Show Image Anyway",
      click: function() {
        showImage()
      }
    }).insertBefore("#gallOverlay .next");
  }
}

function readyImg() {
  if ($("#gallOverlay").find("img").length == 0 || $("body").find("#gallOverlay").length == 0) {
    return;
  }
  if ( document.getElementById("gallOverlay").querySelector("img").complete ) {
    imageLoaded = true;
    showImage();
  } else if (!document.getElementById("gallOverlay").querySelector("img").complete) {
    setTimeout(readyImg, 100);
  } else {
    console.log("What the fuck?");
  };
}

function changePicture(ind, field) {
  var newPic = $(`.item.${field}`).eq(ind).attr("img"),
  newCode = $(`.item.${field}`).eq(ind).attr("code");
  imageLoaded = false;

  $("#gallOverlay img").replaceWith(function(){
    return $("<img>", {
      src: newPic,
      style: "display: none;"
    })
  });

  imgLoader();

  if(!imageLoaded) {
    readyImg();
  }

    
  $("#gallOverlay .source").attr("opens", newCode);
}

fetch(`${window.location.hostname == "www.themonster.xyz" || window.location.hostname == "localhost" ? "." : "https://www.themonster.xyz" }/docs/profiles.json`)
  .then(res => {
    return res.json();
  })
  .then(data => {
    $.each(data, function(field) {
      var size = data[field].length;
      $("#gallery .scroller").append($("<h2>", {
        html: `${field} &nbsp &nbsp <i class="blurple">${size}</i>`
      }));
      $("#gallery .scroller").append($("<div>", {
        class: `flexBox ${field}`,
        style: "margin-bottom: 5vh;"
      }));
      if(field !== "free") {
        for(i = 0; i < size; ++i){
          var picture = data[`${field}`][i]['preview'];
          var background = data[`${field}`][i]['background'];

          $("<div />", {
            class: `item ${field}`,
            img: picture,
            style: `background-image: url(${background})`,
            name: data[`${field}`][i]['name'],
            click: function() {
              curIndex = $(this).index();
              images = $(`.item.${field}`).length;
              
              // function changePicture(ind) {
              //   var newPic = $(`.item.${field}`).eq(ind).attr("img");
            
              //   $("#gallOverlay img").replaceWith(function(){
              //     return $("<img>", {
              //       src: newPic
              //     })
              //   });
              // }
    
              $("<div />", {
                id: "gallOverlay"
              }).insertBefore("#tooltips");
    
              $("<div />", {
                class: "flexBox"
              }).appendTo("#gallOverlay");
    
              $("<div />", {
                id: "gallExit",
                click: function() {
                  $("#gallOverlay").fadeOut(200);
                    setTimeout(function(){
                    $("#gallOverlay").remove();
                  }, 200);
                }
              }).appendTo("#gallOverlay .flexBox")
    
              $("<div />", {
                class: "prev",
                click: function() {
                  if(curIndex !== 0) {
                  --curIndex;
                  changePicture(curIndex, field)
                  } else {
                    curIndex = images - 1;
                    changePicture(curIndex, field)
                  }
                }
              }).appendTo("#gallOverlay .flexBox");
    
              $("<img>", {
                src: $(this).attr("img"),
                style: "display: none"
              }).appendTo("#gallOverlay .flexBox");

              $("<div />", {
                class: "next",
                click: function() {
                  if(curIndex !== (images - 1)) {
                    ++curIndex;
                    changePicture(curIndex, field)
                  } else {
                    curIndex = 0;
                    changePicture(curIndex, field)
                  }
                }
              }).appendTo("#gallOverlay .flexBox");

              imgLoader();
              if(!document.getElementById("gallOverlay").querySelector("img").complete) {
                readyImg();
              }
            },
            mouseenter: function() {
              var tipPosition = $(this).offset();
              var width = $(this).outerWidth();
    
              if(orient == "portrait") {
                return;
              }

              $("#tooltips").append($("<div />", {
                class: `tooltip top`,
                style: `top: ${tipPosition.top}px; left: ${tipPosition.left + width/2}px`,
                html: $(this).attr("name")
              }));
            },
            mouseleave: function() {
              $(".tooltip").remove();
            }
          }).appendTo(`.flexBox.${field}`);
          // `Profile owner: ${data[`${field}`][i]['name']} || Preview: ${data[`${field}`][i]['preview']}`
        }
      } else {
        for(i = 0; i < size; ++i){
          var picture = data[`${field}`][i]['preview'];
          var background = data[`${field}`][i]['background'];

          $("<div />", {
            class: `item ${field}`,
            style: `background-image: url(${background})`,
            img: picture,
            name: data[`${field}`][i]['name'],
            code: data[`${field}`][i]['code'],
            click: function() {
              curIndex = $(this).index();
              images = $(`.item.${field}`).length;
    
              $("<div />", {
                id: "gallOverlay"
              }).insertBefore("#tooltips");
    
              $("<div />", {
                class: "flexBox"
              }).appendTo("#gallOverlay");
    
              $("<div />", {
                id: "gallExit",
                click: function() {
                  $("#code").fadeOut(200);
                  setTimeout(function(){
                    $("#code").remove();
                  }, 200);

                  $("#gallOverlay").fadeOut(200);
                    setTimeout(function(){
                    $("#gallOverlay").remove();
                  }, 200);
                }
              }).appendTo("#gallOverlay .flexBox")
    
              $("<div />", {
                class: "prev",
                click: function() {
                  $("#code").fadeOut(200);
                  setTimeout(function(){
                    $("#code").remove();
                  }, 200);

                  if(curIndex !== 0) {
                  --curIndex;
                  changePicture(curIndex, field)
                  } else {
                    curIndex = images - 1;
                    changePicture(curIndex, field)
                  }
                }
              }).appendTo("#gallOverlay .flexBox");
    
              $("<div />", {
                class: "imageHolder"
              }).appendTo("#gallOverlay .flexBox");
    
              $("<img>", {
                src: $(this).attr("img"),
                style: "display: none"
              }).appendTo("#gallOverlay .flexBox .imageHolder");

              $("<div />", {
                class: "source",
                opens: $(this).attr("code"),
                html: "<span>View Source</span>",
                click: function () {
                  if(showCode) {
                    return;
                  }

                  var url = $(this).attr("opens");

                  showCode = true;
                  $.ajax({
                    url: url,
                    dataType: 'text',
                    success: function (data) {
                      $("body").append($("<div />", {
                        id: "code"
                      }));

                      $("<div />", {
                        class: "texture"
                      }).appendTo("#code");
    
                      if(orient == "portrait") {
                        $("<h1>", {
                          class: "announce",
                          html: "Please do this on a computer"
                        }).appendTo("#code");
                      }

                      $("<div />", {
                        class: "scrollerWrap"
                      }).appendTo("#code");
    
                      $("<div />", {
                        class: "scroller"
                      }).appendTo("#code .scrollerWrap");
    
                      $("<textarea>", {
                        text: data,
                        readonly: ""
                      }).appendTo("#code .scroller");
    
                      $("<div />", {
                        class: "exit",
                        click: function() {
                          
                          showCode = false;

                          $("#code").fadeOut(200);
                          setTimeout(function(){
                            $("#code").remove();
                          }, 200);
                        }
                      }).appendTo("#code");
    
                      $("<div />", {
                        class: "choices"
                      }).appendTo("#code")
    
                      $("<div />", {
                        class: "choice",
                        html: "CSS Only",
                        click: function() {
                          var cssEnd = data.search("/style") - 1,
                          subString = data.slice(7, cssEnd);
    
                          $("#code textarea").val(subString);
                        }
                      }).appendTo("#code .choices");
    
                      $("<div />", {
                        class: "choice",
                        html: "HTML Only",
                        click: function() {
                          var htmlStart = data.search("/style") + 7,
                          subString = data.slice(htmlStart);
    
                          $("#code textarea").val(subString);
                        }
                      }).appendTo("#code .choices");
    
                      $("<div />", {
                        class: "choice",
                        html: "Show Full Code",
                        click: function() {
                          $("#code textarea").val(data);
                        }
                      }).appendTo("#code .choices");
    
                      $("<div />", {
                        class: "choice",
                        html: "Copy Code",
                        click: function() {
                          $("#code textarea").select();
                          document.execCommand("copy");
                          $(this).css("color", "var(--green)");
                          $(this).html("Code copied!");
                          if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                          } else if (document.selection) {
                            document.selection.empty();
                          }
    
                          setTimeout(function(){
                            $("#code .choices .choice:last-child").html("Copy Code");
                            $("#code .choices .choice:last-child").removeAttr("style");
                          }, 2000);
                        }
                      }).appendTo("#code .choices");
                    },
                    error: function() {
                      console.log("Welp....");
                    }
                  })
                }
              }).appendTo("#gallOverlay .flexBox .imageHolder");
    
              $("<div />", {
                class: "next",
                click: function() {
                  $("#code").fadeOut(200);
                  setTimeout(function(){
                    $("#code").remove();
                  }, 200);

                  if(curIndex !== (images - 1)) {
                    ++curIndex;
                    changePicture(curIndex, field)
                  } else {
                    curIndex = 0;
                    changePicture(curIndex, field)
                  }
                }
              }).appendTo("#gallOverlay .flexBox");

              imgLoader();
              if(!document.getElementById("gallOverlay").querySelector("img").complete) {
                readyImg();
              }
            },
            mouseenter: function() {
              var tipPosition = $(this).offset();
              var width = $(this).outerWidth();

              if(orient == "portrait") {
                return;
              }
    
              $("#tooltips").append($("<div />", {
                class: `tooltip top`,
                style: `top: ${tipPosition.top}px; left: ${tipPosition.left + width/2}px`,
                html: $(this).attr("name")
              }));
            },
            mouseleave: function() {
              $(".tooltip").remove();
            }
          }).appendTo(`.flexBox.${field}`);
        }
      }
      $("#gallery .scroller").append($("<hr>"));
      });
      return data
  })
  .then(res => {
    var container = $(".scrollerWrap.body.notLoaded");
    container.waitForImages(()=>{
      container.animate({
        "opacity": "1",
      }, 200);
      setTimeout(() => {
        container.css("pointer-events", "all");
      }, 200);
      loaded = true;
    })
      endLoad();
  })
  .catch(err => {
    logError(err);
  })