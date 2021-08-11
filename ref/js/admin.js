$(document).ready(function () {
  // show all the attractions
  getAllAttractions(function (results) {
    // $("#all-attractions").empty();
    results.forEach((attr) => {
      let $row = $("<tr>");
      $row.append($("<td>").text(attr.name));
      $row.append($("<td>").text(attr.description));
      $row.append($("<td>").text(attr.minGroupSize));
      $row.append($("<td>").text(attr.maxGroupSize));
      $row.append(
        $("<td>").append(
          $("<button>").attr("onclick", "editAttraction()").text("edit")
        )
      );
      // $row.append($("<td>").append($("<button>").attr("onclick", "removeAttraction()").text("delete")));
      $("#all-attractions").append($row);
    });
  });

  // set the event name
  setEventName();

  // broadcast
  $("#broadcast-send").on("click", function () {
    let message = $("#input-message").val();
    let password = $("#input-password").val();
    broadcastMessage(message, password, function (results) {
      $("#input-message").val("");
      $("#input-password").val("");
      if (results.err) {
        alert(results.err);
      } else {
        alert(results);
      }
    });
  });
  $("#input-message").on("input", function () {
    // console.log($("#input-message").val());
    $("#broadcast-message").text($("#input-message").val());
  });

  // update event with new name
  $("#save-event").on("click", function () {
    let newName = $("#event-name").find("input").val();
    if (newName == "") {
      alert("Event name cannot be blank");
    } else {
      updateEventName(newName, function (results) {
        if (results.error) {
          alert("Error updating name");
        } else {
          setEventName();
        }
      });
    }
  });
  $("#revert-event").on("click", function () {
    setEventName();
  });

  // add an attraction
  $("#add-attraction").on("click", function () {
    let params = {
      name: $("#attraction-name").val(),
      description: $("#attraction-description").val(),
      image: $("#attraction-image").val(),
      slots: [],
    };
    let slots = [];
    // loop through the table's rows
    $("table .slot").each(function () {
      // if the row is a slot
      params.slots.push({
        label: $(this).find(".slot-label").val(),
        capacity: $(this).find(".slot-capacity").val(),
      });
    });
    // send POST request
    addAttraction(params, function () {
      alert("attraction added!");
    });
  });

  // add new slot row to table
  $("#add-slot").click(function () {
    let $buttonRow = $(this).closest("tr");
    let $newRow = $("<tr>").addClass("slot");
    $newRow.append(
      $("<td>").append($("<input>").attr("type", "text").addClass("slot-label"))
    );
    $newRow.append(
      $("<td>").append(
        $("<input>").attr("type", "text").addClass("slot-capacity")
      )
    );
    $newRow.append(
      $("<td>").append(
        $("<button>").attr("onclick", "removeSlot($(this))").text("delete")
      )
    );
    $newRow.insertBefore($buttonRow);
  });
});

function makeEditable($elem) {
  let text = $elem.text();
  if (!$elem.has("input").length) {
    $elem.empty();
    $elem.append($("<input>").val(text));
  }
  if ($elem.has($("#event-name"))) {
    $("#save-event").prop("disabled", false);
    $("#revert-event").prop("disabled", false);
  }
}

function removeSlot($elem) {
  $elem.closest("tr").remove();
}

function setEventName() {
  // disable edit buttons
  $("#save-event").prop("disabled", true);
  $("#revert-event").prop("disabled", true);
  getEvent(function (results) {
    if (results.length == 1) {
      $("#event-name").text(results[0].name);
    }
  });
}

function getEvent(callback) {
  let url = "https://api.cusmartevents.com/api/events";
  // make the request
  $.get(url, function (results) {
    callback(results);
  });
}

function getAllAttractions(callback) {
  let url = "https://api.cusmartevents.com/api/attractions";
  // make the request
  $.get(url, function (results) {
    callback(results);
  });
}

function addAttraction(params, callback) {
  let url = "https://api.cusmartevents.com/api/attractions";
  // make the request
  $.post(url, params, function (results) {
    callback(results);
  });
}

function updateEventName(name, callback) {
  let url = "https://api.cusmartevents.com/api/events";
  // make the request
  $.post(url, { name: name }, function (results) {
    callback(results);
  });
}

function broadcastMessage(message, password, callback) {
  let url = "https://api.cusmartevents.com/api/tracker/broadcast";
  // make the request
  $.post(url, { message: message, password: password }, function (results) {
    callback(results);
  });
}
