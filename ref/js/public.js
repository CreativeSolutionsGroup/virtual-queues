$(document).ready(function () {
  getAllAttractions(function (results) {
    $("#select-attraction").empty();
    // add empty option
    let $option = $("<option>")
      .attr("label", "Select an attraction...")
      .attr("disabled", "disabled")
      .attr("selected", "selected");
    $("#select-attraction").append($option);
    results.forEach((attr) => {
      let $option = $("<option>").val(attr._id).text(attr.name);
      $("#select-attraction").append($option);
    });
  });

  getTotalCheckin(function (results) {
    $("#checkin-total").text(results);
  });
  // and fire every 10 seconds
  setInterval(function () {
    getTotalCheckin(function (results) {
      $("#checkin-total").text(results);
    });
  }, 10000);

  $("#generate-id").on("click", function () {
    getCheckinID(function (results) {
      if (results) {
        $("#random-id").text(results.studentID);
        $("#random-phone").text(results.phone);
        console.log(results);
      } else {
        $("#random-id").text("no more ID's to choose from");
        $("#random-phone").text("");
      }
    });
  });

  $("#select-attraction").on("change", function () {
    let val = $("#select-attraction").val();
    getAttractionSlots(val, function (results) {
      $("#attraction-slot-list").empty();
      let totalCapacity = 0;
      let currCapacity = 0;
      results.forEach((slot) => {
        totalCapacity += slot.capacity;
        currCapacity += slot.waiting;
        // let percentage = Math.round(100 - (currCapacity / totalCapacity) * 100);
        //console.log(percentage)
        $("#attraction-capacity").text(
          (100 - (currCapacity / totalCapacity) * 100).toString()
        );
        let $li = $("<li>").text(
          `${slot.label} (${slot.capacity - slot.waiting}/${slot.capacity})`
        );
        $("#attraction-slot-list").append($li);
      });
    });
  });
});

function getAllAttractions(callback) {
  let url = "https://api.cusmartevents.com/api/attractions";
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

function getTotalCheckin(callback) {
  let url = "https://api.cusmartevents.com/api/tracker";
  // make the request
  $.get(url, function (results) {
    callback(results);
  });
}

function getCheckinID(callback) {
  let url = "https://api.cusmartevents.com/api/tracker/attendees";
  // make the request
  $.get(url, function (results) {
    callback(results);
  });
}
