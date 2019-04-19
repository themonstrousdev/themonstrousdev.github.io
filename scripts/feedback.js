fetch("https://getsimpleform.com/messages.json?api_token=c3d5d9499780701b4ce87450444c2390")
  .then(res => {
    return res.json()
  })
  .then(data => {
    var i;
    if (data.length == 0) {
      $("#feedback #comments").append("<h2 style='padding: 0; text-align: center'>No one has left a feedback yet! Be the first one.</h2>");
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
  })