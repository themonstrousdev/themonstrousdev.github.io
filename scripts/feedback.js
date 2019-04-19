fetch("https://getsimpleform.com/messages.json?api_token=c3d5d9499780701b4ce87450444c2390")
  .then(res => {
    return res.json()
  })
  .then(data => {
    var i;
    if (data.length == 0) {
      $("#feedback #comments").append("<h2 style='padding: 0; text-align: center; font-family: Hemera, sans-serif; text-transform: lowercase;font-size: 2vw;'>No one has left a feedback yet! Be the first one.</h2>");
    } else {
      for(i = 0; i < data.length; i++) {
        var date = moment(data[i]["created_at"]).format("LLL"),
        sender = data[i]["data"].sender,
        message = data[i]["data"].message;
        
        $("<div>", {
          class: "commentContainer"
        }).appendTo("#comments");

        $("<div>", {
          class: "sender",
          html: `${sender == ""?"Anonymous":sender} <span>${date}</span>`
        }).appendTo("#comments .commentContainer:last-child");

        $("<div>", {
          class: "message",
          html: message
        }).appendTo("#comments .commentContainer:last-child");
      }
    }

    var formPos = $("form").offset(),
      scrollerPos = $(".scroller").offset(),
      scrollInner = $(".scroller").innerHeight();

      console.log(formPos.top > scrollerPos.top+scrollInner);

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