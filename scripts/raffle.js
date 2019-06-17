var raffles, ip;

function getIP() {
  $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
    function(json) {
      ip = json.ip;
    }
  );
}

function fetchData() {
  fetch("https://getsimpleform.com/messages.json?api_token=47d89ff8dfc0c28f18199752e9d3ff39")
  .then(res => {
    return res.json()
  })
  .then(data => {
    raffles = data;
    loaded = true;
    endLoad();
  })
  .catch(err => {
    logError(err);
  });
};

fetchData();
getIP();

$("#updates button[type=submit]").click(()=>{
  var type = $("[name=type]").val(),
  sender = $("[name=sender]").val(),
  email = $("[name=email]").val(),
  discord = $("[name=discord]").val(),
  message = $("[name=message]").val(),
  i;

  if($("b.red.reply")) {
    $("b.red.reply").fadeOut(500);
    setTimeout(() => {
      $("b.red.reply").remove();
    }, 500);
    $("[name=message]").removeAttr("style");
  }

  if(sender == "" || sender == null) {
    $("<b>", {
      class: "red reply",
      style: "text-align: center",
      html: "Please enter your RPC name"
    }).insertBefore("#updates form");

    $("[name=message]").css("box-shadow", "box-shadow: 0 0 1vh var(--red);");

    return false;
  }

  for(i = 0; i < raffles.length && raffles[i]["request_ip"] != ip; i++) {};

  if(i < raffles.length) {
    $("<b>", {
      class: "red reply",
      style: "text-align: center",
      html: "You've already submitted a raffle entry!"
    }).insertBefore("#updates form");

    $("[name=message]").css("box-shadow", "box-shadow: 0 0 1vh var(--red);");
  }

  $.ajax({
    dataType: 'jsonp',
    url: "https://getsimpleform.com/messages/ajax?form_api_token=7fc36e783f51a74e9efc7d5fe7391686",
    data: {
      type: type,
      sender: sender,
      email: email,
      discord: discord,
      message: message
    }
  }).done(function() {
    $("<b>", {
      class: "green reply",
      style: "text-align: center",
      html: "Feedback sent!"
    }).insertBefore("#updates form");

    setTimeout(() => {
      $("b.green.reply").fadeOut(500);
      setTimeout(() => {
        $("b.green.reply").remove();
      }, 500);
    }, 3000);
  });

  $("[name=sender], [name=email], [name=message], [name=]").val("");

  

  return false;
});