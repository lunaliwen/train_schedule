// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the minutes away and next train. Using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes.

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyBSQLQweErYlxTvWa_GQJyaGy51wHQogOE",
  authDomain: "lpsgo-97f7b.firebaseapp.com",
  databaseURL: "https://lpsgo-97f7b.firebaseio.com",
  projectId: "lpsgo-97f7b",
  storageBucket: "lpsgo-97f7b.appspot.com",
  messagingSenderId: "583502223469"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = moment($("#time-input").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#period-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };
  console.log(newTrain);

  // Uploads train data to the database
  database.ref().push(newTrain);
  

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#period-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var newtrainName = childSnapshot.val().name;
  var newtrainDestination = childSnapshot.val().destination;
  var newtrainStart = childSnapshot.val().start;
  var newtrainFrequency = childSnapshot.val().frequency;

  // Employee Info
  console.log(newtrainName);
  console.log(newtrainDestination);
  console.log(newtrainStart);
  console.log(newtrainFrequency);

  // To calculate the difference between the first train time and current time
  var trainMinutes = moment().diff(moment(newtrainStart, "X"), "minutes");
  console.log(trainMinutes);

  // Calculate minutes away and next Arrival
  var minutesAway = newtrainFrequency-trainMinutes % newtrainFrequency;
  console.log(minutesAway);

  var nextArrive = parseInt(moment().format("X")) + (minutesAway*60);
  console.log(nextArrive);
  var nextArrival = moment(nextArrive, "X").format("HH: mm");
  console.log(nextArrival);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(newtrainName),
    $("<td>").text(newtrainDestination),
    $("<td>").text(newtrainFrequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesAway),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});