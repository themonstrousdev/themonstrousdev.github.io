fetch(`${window.location.hostname == "www.themonster.xyz" || window.location.hostname == "localhost" ? "." : "https://www.themonster.xyz" }/docs/list.json`)
  .then(res => {
    return res.json()
  })
  .then(data => {
    $.each(data, function(field) {
      var length = data[field].length,
      scroller = $("#list .scroller"),
      list;
      scroller.append("<hr>");
      scroller.append($("<h2>", {
        html: `${field}:`
      }));

      if(field == "Accomodating") {
        scroller.append($("<ol>", {
          id: "accomodate-list"
        }));
        list = $("#accomodate-list");
        for(var i = 0; i < length; i++) {
          var name = data[`${field}`][i]['name'],
          stage = data[`${field}`][i]['stage'],
          comment = data[`${field}`][i]['comment'];

          list.append($("<li>", {
            html: `<b class="fGreen">${name}</b> ${stage ? `- <b>${stage}</b>` : ""}${comment ? ` - <span class="${comment.color}">${comment.text}</span>` :""}`
          }))
        }
      } else if (field == "Waiting List") {
        scroller.append($("<ul>", {
          id: "waiting-list",
          class: "bullet"
        }));
        list = $("#waiting-list");
        for(var i = 0; i < length; i++) {
          list.append($("<li>", {
            html: `<b class="fYellow">${data[`${field}`][i]}</b>`
          }))
        }
      } else if (field == "Pending Payment" || field == "On Hold") {
        scroller.append($("<ol>", {
          id: `${field == "Pending Payment" ? "pending-payment" : "on-hold"}`
        }));
        list = field == "Pending Payment" ? $("#pending-payment") : $("#on-hold");
        for(var i=0;i<length;i++) {
          var name = data[`${field}`][i]['name'],
          comment = data[`${field}`][i]['comment'];

          list.append($("<li>", {
            html: `<b class="greyple">${name}</b>${!comment?"": comment.weight == "bold" ? ` - <b class="${comment.color}">${comment.text}</b>`:` - <span class="${comment.color}">${comment.text}</span>`}`
          }))
        }
      } else {
        logError("Unknown list type");
      }
    })

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