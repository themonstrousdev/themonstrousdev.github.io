var previousData = null;

function processComments(data) {
  var i;
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
  if (data.length == 0) {
    $("#feedback #comments").append("<h2 style='padding: 0; text-align: center; font-family: Hemera, sans-serif; text-transform: lowercase;font-size: 2vw;'>No one has left feedback yet! Be the first one.</h2>");
  } else {
    for(i = 0; i < data.length; i++) {
      var date = moment(data[i]["created_at"]).format("LLL"),
      sender = data[i]["data"].sender,
      message = data[i]["data"].message;
      
      $("<div>", {
        class: "commentContainer"
      }).prependTo("#comments");

      $("<div>", {
        class: "sender",
        html: `${sender == ""?"Anonymous":sender} <span>${date}</span>`
      }).appendTo("#comments .commentContainer:first-child");

      $("<div>", {
        class: "message",
        html: message
      }).appendTo("#comments .commentContainer:first-child");
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
    logError(err);
  });
};

fetchData();

$("#feedback button[type=submit]").click(()=>{
  var sender = $("[name=sender]").val(),
  email = $("[name=email]").val(),
  message = $("[name=message]").val();

  $.ajax({
    dataType: 'jsonp',
    url: "https://getsimpleform.com/messages/ajax?form_api_token=7d9c26e78cee5187a4f70d084223f5a5",
    data: {
      sender: sender,
      email: email,
      message: message
    }
  }).done(function() {
    $("<span>", {
      class: "green reply",
      style: "text-align: center",
      html: "Feedback sent!"
    }).insertBefore("#feedback form");

    setTimeout(() => {
      $("span.green.reply").fadeOut(200);
    }, 1000);
  });
  fetchData();

  return false;
});