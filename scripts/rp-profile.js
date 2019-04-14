function showRP() {
  fetch("https://www.themonster.xyz/src/rp-profile.html")
    .then(res => {
      return res.text()
    })
    .then(text => {
      var cut = text.search("/script") + 8,
      html = text.slice(cut);

      $("<div>", {
        id: "background",
        html: html
      }).insertBefore("script:first-of-type");
    })
}

function removeRP() {
  $("#background").fadeOut(200);
  setTimeout(() => {
    $("#background").remove();
  }, 200);
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
  })

  $("#exitProfile").click(()=> {
    removeRP();
  })
})