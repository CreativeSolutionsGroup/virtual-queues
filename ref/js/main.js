$(document).ready(function () {
  if ($(window).width() > 1080) {
    alert("View on mobile device for best experience!");
  }

  // NOTIFICATION
  $("#notification-overlay").show();
  setOverlay();

  // spin the loading icon spinIcon is called
  let degree = 0;
  setInterval(function () {
    degree += 2;
    if (degree >= 360) degree = 0;
    $("#loading-icon").css("transform", "rotate(" + degree + "deg)");
  }, 10);
  $("#loading").hide(); // hide the loading screen on start

  // set the event name in navbar
  getEvent(function (results) {
    if (results.length == 1) {
      $("#event-name").text(results[0].name);
    }
    // set margin after the event name has been set
    setMarginOffset();
  });

  // list all the attractions
  getAllAttractions(function (results) {
    console.log(results);
    results.data.forEach((attr) => {
      let $attraction = $("<div>");
      // photo
      let $photo = $("<div>").addClass("photo");
      $photo.append($("<img>").attr("src", attr.imageURL));
      $attraction.append($photo);
      // body
      let $body = $("<div>").addClass("attraction-body");
      $body.append($("<h2>").text(attr.name));
      $body.append($("<p>").text(attr.description));
      // let $ticket = $("<div>").append($("<a>").addClass("ticket").attr("role", "button").attr("attr-id", attr._id).attr("attr-name", attr.name).attr("attr-min", attr.minGroupSize).attr("attr-max", attr.maxGroupSize).attr("href", "https://docs.google.com/forms/d/e/1FAIpQLScfzgoctR_29kV9dzpWSOx09eADnVICUmX24da4LjePgkelAA/viewform").attr("onclick", "attractionOverlay($(this))").append($("<i>").addClass("fa fa-ticket")));
      let $ticket = $("<div>").append(
        $("<a>")
          .addClass("ticket")
          .attr("onclick", "attractionOverlay($(this))")
          .attr("role", "button")
          .attr("attr-id", attr._id)
          .attr("attr-name", attr.name)
          .attr("attr-min", attr.minGroupSize)
          .attr("attr-max", attr.maxGroupSize)
          .attr("attr-about", attr.about)
          .append($("<i>").addClass("fa fa-ticket"))
      );
      $body.append($ticket);
      $attraction.append($body);
      // add attraction
      $("#attractions").append($attraction);
    });
  });

  // info button
  $("#info").click(function () {
    $("#info-overlay").show();
    setOverlay();
  });
  // cancel buttons
  $(".cancel").click(function () {
    removeOverlay();
  });
  // slot chosen
  $("#reserve").click(function () {
    // show the loading screen
    $("#loading").show();
    // make the request to create the pass
    let phone =
      $("#phone-number").attr("number").length == 10
        ? "1" + $("#phone-number").attr("number")
        : $("#phone-number").attr("number");
    let params = {
      slotID: $(".slot-selected").attr("slot-id"),
      // groupSize: $("#group-size").text(),
      groupSize: 1,
      phone: "+" + phone,
    };
    createPass(params, function (results) {
      $("#loading").hide();
      if (results.error) {
        // there was an error, go back to the attraction screen and update the slots and show error
        updateSlots();
        $("#error-message").show();
        $("#error-message").text("Sorry! There was an error: " + results.error);
      } else {
        $("#attraction-overlay").hide();
        $("#pass-overlay").show();
      }
    });
  });

  // format phone number
  $("#phone-number").on("input", function () {
    formatPhone();
    toggleButtonIfComplete();
  });

  // logic for group counter
  $("#group-counter-plus").click(function () {
    let currSize = $("#group-size").text();
    currSize = isNaN(parseInt(currSize)) ? 0 : parseInt(currSize); // sanitize
    $("#group-size").text(currSize + 1);
    updateGroupCounter();
  });
  $("#group-counter-minus").click(function () {
    let currSize = $("#group-size").text();
    currSize = isNaN(parseInt(currSize)) ? 0 : parseInt(currSize); // sanitize
    $("#group-size").text(currSize - 1);
    updateGroupCounter();
  });
});

// function sets the overlay for an attraction when ticket is clicked
function attractionOverlay($this) {
  // show the overlay
  $("#attraction-overlay").show();
  setOverlay();
  // configure overlay for selected attraction
  configureOverlay($this);
}

function configureOverlay($this) {
  console.log($this.attr("attr-min"));
  // console.log($this);
  $("#error-message").hide(); // hide the error message
  $("#phone-number").empty(); // wipe the phone number
  $("#selected-attr-name").text($this.attr("attr-name"));
  // $("#selected-attr-max").text($this.attr("attr-max"));
  $("#selected-attr-about").text($this.attr("attr-about"));
  // configure the group counter with the min and max group size
  setGroupCounter(
    parseInt($this.attr("attr-min")),
    parseInt($this.attr("attr-max"))
  );
  // set the slots
  $("#slots").empty();
  $("#slots-message").show();
  $("#slots-message").text("Gathering time slots...");
  getAttractionSlots($this.attr("attr-id"), function (results) {
    results.sort(function (a, b) {
      if (a.disappear < b.disappear) return -1;
      else if (a.disappear > b.disappear) return 1;
      else return 0;
    });
    // console.log(results);
    results.data.forEach((slot) => {
      console.log(slot);
      let $slot = $("<a>")
        .addClass("slot")
        .attr("onclick", "selectSlot($(this))")
        .attr("curr-capacity", slot.capacity - slot.waiting)
        .attr("slot-id", slot._id)
        .text(slot.label);
      $("#slots").append($slot);
    });
    updateSlots();
  });
}

// db.slots.insert([{attractionID: ObjectId("5fadbe31d9abd01c4b821323"), label: "12:10PM", capacity: 3, disappear:87000},{attractionID: ObjectId("5fadbe31d9abd01c4b821323"), label: "12:30PM", capacity: 3, disappear:88200}])

// sets the counter initially with min and max values
function setGroupCounter(min, max) {
  $("#group-counter").attr("min", min);
  $("#group-counter").attr("max", max);
  $("#group-size").text(min);
  if (min == max) {
    $("#group-counter-plus").prop("disabled", true);
    $("#group-counter-minus").prop("disabled", true);
  } else {
    $("#group-counter-plus").prop("disabled", false);
    $("#group-counter-minus").prop("disabled", true);
  }
}

function updateGroupCounter() {
  let currSize = $("#group-size").text();
  let min = $("#group-counter").attr("min");
  let max = $("#group-counter").attr("max");
  currSize = isNaN(parseInt(currSize)) ? min : parseInt(currSize); // sanitize
  // check if user manually updated the group size to outside bounds
  if (currSize < min || currSize > max) {
    currSize = min;
    $("#group-size").text(currSize);
  }
  // disable buttons if on edge of allowed range
  if (currSize == max) {
    $("#group-counter-plus").prop("disabled", true);
  } else if (currSize == min) {
    $("#group-counter-minus").prop("disabled", true);
  } else {
    $("#group-counter-plus").prop("disabled", false);
    $("#group-counter-minus").prop("disabled", false);
  }
  // update the slots based on the new group size
  updateSlots();
}

function updateSlots() {
  let available = false;
  $(".slot").each(function () {
    // if ($(this).attr("curr-capacity") >= parseInt($("#group-size").text())) {
    // for the time being, all passes are for 1 person
    console.log($(this).attr("curr-capacity"));
    if (parseInt($(this).attr("curr-capacity")) > 0) {
      $(this).show();
      available = true;
    } else {
      $(this).removeClass("slot-selected");
      $(this).hide();
    }
  });
  // post sorry message if no slots are available
  if (!available) {
    $("#slots").hide();
    $("#slots-message").text(
      "Sorry, no time slots are available for that group size."
    );
    $("#slots-message").show();
  } else {
    $("#slots").show();
    $("#slots-message").hide();
  }
  toggleButtonIfComplete();
}

function formatPhone() {
  // put text in number attribute
  let text = $("#phone-number").val();
  let numbers = text.replace(/[^\d]/g, "");
  let formatted = "";
  if (numbers.length == 0) {
    formatted = "";
  } else if (numbers.length < 4) {
    formatted = numbers.substring(0, 3);
  } else if (numbers.length < 7) {
    formatted = `${numbers.substring(0, 3)}-${numbers.substring(3, 6)}`;
  } else if (numbers.length < 11) {
    formatted = `${numbers.substring(0, 3)}-${numbers.substring(
      3,
      6
    )}-${numbers.substring(6, 10)}`;
  } else {
    formatted = `+${numbers.substring(0, 1)} ${numbers.substring(
      1,
      4
    )}-${numbers.substring(4, 7)}-${numbers.substring(7, 11)}`;
  }
  $("#phone-number").attr("number", numbers);
  $("#phone-number").val(formatted);
}

function toggleButtonIfComplete() {
  let phone = $("#phone-number").attr("number");
  let selectedSlot = $(".slot-selected").length == 1;
  if ((phone.length == 10 || phone.length == 11) && selectedSlot) {
    $("#reserve").prop("disabled", false);
  } else {
    $("#reserve").prop("disabled", true);
  }
}

function setOverlay() {
  $("#wrapper").addClass("no-scroll");
  $("#wrapper").addClass("blur");
  $("#navbar").addClass("blur");
}

function removeOverlay() {
  $(".overlay").hide();
  $("#wrapper").removeClass("no-scroll");
  $("#wrapper").removeClass("blur");
  $("#navbar").removeClass("blur");
}

function setMarginOffset() {
  let $wrapper = $("#wrapper");
  $wrapper.css("margin-top", $("#navbar").height());
}

function selectSlot($selected) {
  $(".slot").removeClass("slot-selected");
  $selected.addClass("slot-selected");
  toggleButtonIfComplete();
}

//
// functions for interfacing with backend
//

function getAllAttractions(callback) {
  let url = "https://api.cusmartevents.com/api/events";
  // make the request
  $.get(url, function (results) {
    callback(results);
  });
}

function getAttractionSlots(id, callback) {
  let url = `https://api.cusmartevents.com/api/attractions/${id}/slots`;
  // make the request
  $.get(url, function (results) {
    callback(results);
  });
}

function getEvent(callback) {
  let url = "https://api.cusmartevents.com/api/events";
  // make the request
  $.get(url, function (results) {
    callback(results);
  });
}

function createPass(params, callback) {
  let url = `https://api.cusmartevents.com/api/slots/${params.slotID}/passes`;
  // make the request
  // console.log(params.phone);
  // console.log(params.groupSize);
  $.post(
    url,
    { phone: params.phone, groupSize: params.groupSize },
    function (results) {
      callback(results);
    }
  );
}
