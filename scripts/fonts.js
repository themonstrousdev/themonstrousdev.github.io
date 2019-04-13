fetch("https://www.themonster.xyz/styles/fancy-fonts.css")
  .then(res => {
  
    return res.text()
  })
  .then(data => {
    logSuccess("Caught fonts!");

    var quotes = ["Hold me close and hold me fast. This magic spell you cast.", "When you press me to your heart, we're in a worl apart. A world where roses bloom", "And when you speak angels sing from above. Everyday words seem to turn into love songs.", "What's the matter with you, baby? You look really sad.", "Marry a rich boy. Be a rich girl. Buy a big house, on top of the world.", "Why are you so angry? Have I done something bad? If it isn't me, then sing me your song.", "Play nice, dress up, don't forget your make up. You really should impress him, once you take your medicine", "If I'm in a crowd, do I stand alone? You know all the words but don't sing along.", "I want to make you mine and take you everywhere I go.", "I don't need a camera to see your point of view. I need someone to turn to.", "I guess my heart never learns. No use in finding the words.", "You're never here when it hurts. 'Cause I'm a joke waiting for the punchline.", "When he sees me, what if he doesn't like it? What if he opens up a door and I can't close it? What happens then?", "If when he holds me, my heart is set in motion. What if I give myself away to only get it given back. How could I live with that?", "How do we fall in love harder than a bullet could hit you?", "How do we fall apart faster than a hair pin trigger?", "Shut your mouth, baby, stand and deliver. Holy hands, oh, they make me a sinner.", "Choke this love 'til the veins start to shiver. One last breath 'til the tears start to wither."];
    var lastQuote = Math.floor(Math.random() * Math.floor(quotes.length)), nextQuote = null,
    allFonts = [];

   while(data.includes("font-family")) { 
      var font = data.slice(data.search("font-family") + 12, data.search(";"));
      data = data.slice(data.search("}")+1);
      allFonts.push(font);
    }

    logPending("Processing font link and preview...");
    $("textarea#google-fonts-link").text('link href="https://www.themonster.xyz/styles/google-fonts.css" rel="stylesheet">')
    $("textarea#fancy-fonts-link").text('<link href="https://www.themonster.xyz/styles/fancy-fonts.css" rel="stylesheet">');

    $("#fonts .scroller").append($("<div>",{
      class: "flexBox"
    }));

    for(var i = 0; i < allFonts.length; i++) {
      var preview = $("<div>", {
        class: "fontContainer"
      }), quote;

      if(nextQuote == null) {
        nextQuote = lastQuote;
        quote = quotes[lastQuote];
      } else if (nextQuote == lastQuote) {
        while(nextQuote == lastQuote) {
          nextQuote = Math.floor(Math.random() * Math.floor(quotes.length));
        }
        quote = quotes[nextQuote];
        lastQuote = nextQuote;
      } else {
        logError("There was a weird error picking quotes. Check your loop.");
      }
      
      $("#fonts .scroller .flexBox").append(preview)

      $("<div>", {
        class: "fontName",
        text: allFonts[i].slice(2, allFonts[i].length-1)
      }).appendTo(".fontContainer:last-child");

      $("<br>").appendTo(".fontContainer:last-child .fontName");

      $(".fontContainer:last-child .fontName").append("<span class='fontSize'>40px</span>   ");

      var input = document.createElement("input");
      input.classList.add("size");
      input.setAttribute("type", "range");
      input.setAttribute("min", "8");
      input.setAttribute("max", "112");

      input.oninput = function() {
        var parent = $(this).parent().parent();
        var size = $(this).parent().find("span.fontSize");
        size.html(`${$(this).val()}px`);
        parent.find(".scroller").css("font-size", `${$(this).val()}px`)
      }

      $(".fontContainer:last-child .fontName").append(input);

      $("<div>", {
        class: "fontPrev",
        style: `font-family: ${allFonts[i]}`
      }).appendTo(".fontContainer:last-child");
      
      $("<div>", {
        class: "scrollerWrap"
      }).appendTo(".fontContainer:last-child .fontPrev");
      
      $("<div>", {
        class: "scroller",
        contenteditable: "true",
        text: quote
      }).appendTo(".fontContainer:last-child .fontPrev .scrollerWrap");
    }

    logSuccess("Loaded all previews!");
    return data;
  })
  .then(res => {
    $(".scrollerWrap.body.notLoaded").animate({
      "opacity": "1"
    }, 500);
      loaded = true;
      endLoad();
  })
  .catch(err => {
    logError("Problem loading fonts. Please check your function");
    logError(err);
  })

// $.ajax({
//   url: "https://www.themonster.xyz/styles/fancy-fonts.css",
//   dataType: "text",
//   success: function(data) {
//   },
//   error: function() {
//     logError("Problem loading fonts. Please check your function.")
//   }
// })