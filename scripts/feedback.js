var previousData = null;

function processComments(data) {
  if(!previousData) {
    previousData = data;
    appendComments(previousData);
  } else if(previousData == data) {
    // do nothing
  } else if (previousData != data) {
    $("#comments").html(""); 
    previousData = data;
    appendComments(previousData);
  }
}

function appendComments(data) {
  var i;
  if (data.length == 0) {
    $("#feedback #comments").append("<h2 class='feedback'>No one has left feedback yet! Be the first one.</h2>");
  } else {
    for(i = 0; i < data.length; i++) {
if(data[i]["request_ip"] != "108.223.209.194") {
      var date = moment(data[i]["created_at"]).max(new Date()),
      sender = data[i]["data"].sender,
      message = data[i]["data"].message,
      relativeTime = date.fromNow(),
      printedTime;

      if(relativeTime.includes("day a")) {
        printedTime = "Yesterday "+date.format("LT");
      } else if (relativeTime.includes("second") || relativeTime.includes("minute") || relativeTime.includes("hour")) {
        printedTime = relativeTime;
      } else {
        printedTime = date.format("LLL");
      }
      


      $("<div>", {
        class: "commentContainer"
      }).appendTo("#comments");

      $("<div>", {
        class: "sender",
        html: `${sender == ""?"Anonymous":sender} <span>${printedTime}</span>`
      }).appendTo("#comments .commentContainer:last-child");

      $("<div>", {
        class: "message",
        html: message
      }).appendTo("#comments .commentContainer:last-child");
    }
}
  }

  var formPos = $("form").offset(),
    scrollerPos = $(".scroller").offset(),
    scrollInner = $(".scroller").innerHeight();

    function scrollToFeedback(scroll) {
      $(".scroller").animate({
        scrollTop: scroll
      }, 500, "swing");
    }

    if(formPos.top > scrollerPos.top+scrollInner) {
      $("#content").append($("<div>", {
        class: "toFeedback",
        html: "Give Feedback",
        click: function() {
          scrollToFeedback(formPos.top);
        }
      }));
    }

    $(".scroller").scroll(function(){
      var btn = $("#content").find(".toFeedback").length;
      formPos = $("form").offset();
      if(formPos.top > scrollerPos.top+scrollInner) {
        if(btn == 0) {
          $("#content").append($("<div>", {
            class: "toFeedback",
            html: "Give Feedback",
            click: function() {
              scrollToFeedback(formPos.top);
            }
          }));
        } 
      } else {
        if(btn > 0) {
          $(".toFeedback").animate({
            "margin-bottom": "-10vh"
          }, 200, ()=>{
            $(".toFeedback").remove();
          });
        }
      }
    });
}

function fetchData() {
  //fetch(`https://getsimpleform.com/messages.json?api_token=${window.location.hostname == "themonstrousdev.github.io" || window.location.hostname == "localhost" ? "47d89ff8dfc0c28f18199752e9d3ff39" : "c3d5d9499780701b4ce87450444c2390"}`)
  fetch("https://getsimpleform.com/messages.json?api_token=c3d5d9499780701b4ce87450444c2390")
  .then(res => {
    return res.json()
  })
  .then(data => {
    processComments(data);
    return data
  })
  .then(res => {
    var container = $(".scrollerWrap.body.notLoaded");
    container.animate({
      "opacity": "1"
    }, 200);
    setTimeout(() => {
      container.css("pointer-events", "all");
    }, 200);
      loaded = true;
    endLoad();
  })
  .catch(err => {
    $("#feedback #comments").append("<h2 class='feedback red'>Something went wrong with fetching the comments!</h2>");
    logError(err);
    endLoad();
  });
};

fetchData();

$("#feedback button[type=submit]").click(()=>{
  var sender = $("[name=sender]").val(),
  email = $("[name=email]").val(),
  message = $("[name=message]").val();

  if($("b.red.reply")) {
    $("b.red.reply").fadeOut(500);
    setTimeout(() => {
      $("b.red.reply").remove();
    }, 500);
    $("[name=message]").removeAttr("style");
  }

  if(message == "" || message == null) {
    $("<b>", {
      class: "red reply",
      style: "text-align: center",
      html: "Please enter feedback"
    }).insertBefore("#feedback form");

    $("[name=message]").css("box-shadow", "box-shadow: 0 0 1vh var(--red);");

    return false;
  }

  $.ajax({
    dataType: 'jsonp',
    //url: `https://getsimpleform.com/messages/ajax?form_api_token=${window.location.hostname == "themonstrousdev.github.io" || window.location.hostname == "localhost" ? "7fc36e783f51a74e9efc7d5fe7391686" : "7d9c26e78cee5187a4f70d084223f5a5"}`,
    url: "https://getsimpleform.com/messages/ajax?form_api_token=7d9c26e78cee5187a4f70d084223f5a5",
    data: {
      sender: sender,
      email: email,
      message: message
    }
  }).done(function() {
    $("<b>", {
      class: "green reply",
      style: "text-align: center",
      html: "Feedback sent!"
    }).insertBefore("#feedback form");

    setTimeout(() => {
      $("b.green.reply").fadeOut(500);
      setTimeout(() => {
        $("b.green.reply").remove();
      }, 500);
    }, 3000);
  });

  $("[name=sender], [name=email], [name=message]").val("");

  setTimeout(() => {
    fetchData();
  }, 500);

  return false;
});
