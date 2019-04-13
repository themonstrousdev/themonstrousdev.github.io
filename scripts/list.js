fetch("https://www.themonster.xyz/docs/list.json")
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
            html: `<b class="fGreen">${name}</b> - <b>${stage}</b> - <span class="${comment.color}">${comment.text}</span>`
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
      } else if (field == "Pending Payment") {
        scroller.append($("<ol>", {
          id: "pending-list"
        }));
        list = $("#pending-list");
        for(var i=0;i<length;i++) {
          var name = data[`${field}`][i]['name'],
          comment = data[`${field}`][i]['comment'];

          list.append($("<li>", {
            html: `<b class="greyple">${name}</b>${comment.text==""?null : comment.weight == "bold" ? ` - <b class="${comment.color}">${comment.text}</b>`:` - <span class="${comment.color}">${comment.text}</span>`}`
          }))
        }
      } else {
        logError("Unknown list type");
      }
    })

    return data
  })
  .then(res => {
    $(".scrollerWrap.body.notLoaded").animate({
      "opacity": "1"
    }, 500);
    loaded = true;
    endLoad();
  })
  .catch(err => {
    logError(err);
  });