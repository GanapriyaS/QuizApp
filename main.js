
var queNo = 0;
var score = 0;
var jsonQuestionObject;
var totalque;
var userAnswerMap = new Map();

function loadBody() {
  $("#login").load("login.html");
  document.getElementById("tot").style.display = "none";
  $.ajax({
    type: 'post',
    url: 'average.php',
    data: {
      updateTotalCount: "usersCount"
    },
    success: function(response) {
      $('#usersCount').html(response);
    }
  });

}

function validateUser() {
  var userId = document.getElementById("userId").value;
  var userPass = document.getElementById("passId").value;
  let flag = 0;

  $.getJSON("auth.json", function(data, status) {
    var jsonDataObject = data;
    if ((userId == jsonDataObject['uid']) && (userPass == jsonDataObject['upass'])) {
      $("#btnSubmitId").removeClass("btn-danger").addClass("btn-success");
      alert("login success");
      $("#login").load("rules.html");
      document.getElementById("tot").style.display = 'block';
      flag = 1;
    } else {
      $("#btnSubmitId").removeClass("btn-success").addClass("btn-danger");
      flag = 0;
      alert("login failed");
      console.log(userId + "-" + jsonDataObject['uid']);
    }
  });

  if (flag == 0) {
    return false;
  } else {
    return true;
  }
}

function validateCheck() {
  var checkTnc = document.getElementById("agree");
  if (checkTnc.checked == false) {
    $("#chec").addClass("alert alert-danger");
  } else {
    $("#chec").removeClass("alert alert-danger");
  }
}

function startQuiz() {
  var checkTnc = document.getElementById("agree");
  if (checkTnc.checked != true) {
    $("#chec").addClass("alert alert-danger");
  } else {
    $("#chec").removeClass("alert alert-danger");
    document.getElementById("tot").style.display = "none";
    $("#login").load("ques.html", function() {
      loadFirstQuestion();
    });
  }
}

function loadFirstQuestion() {

  $.getJSON("data.json", function(data, status) {
    jsonQuestionObject = data;
    totalque = Object.keys(jsonQuestionObject).length;
    $("#quesId").html(jsonQuestionObject[queNo].que);
    $("#opt1Id").html(jsonQuestionObject[queNo].options[0]);
    $("#opt2Id").html(jsonQuestionObject[queNo].options[1]);
    $("#opt3Id").html(jsonQuestionObject[queNo].options[2]);
    $("#opt4Id").html(jsonQuestionObject[queNo].options[3]);
    initlizeUserAnswerMap();
  });
}


function initlizeUserAnswerMap() {
  for (var i = 0; i < totalque; i++) {
    userAnswerMap.set(i, undefined);
  }
}


function nextQuestion() {

  var optionsRadioGroup = document.getElementsByName("ansOption");
  for (var i = 0; i < optionsRadioGroup.length; i++) {
    if (optionsRadioGroup[i].checked == true) {
      userAnswerMap.set(queNo, i);
    }
  }

  queNo++;
  if (queNo == totalque - 1) {
    document.getElementById("btnNext").value = "Finish Quiz";
  } else {
    document.getElementById("btnPrev").disabled = false;
  }
  clearAllRadioBtns();

  if (queNo == totalque) {
    $("#login").load("result.html", function() {
      document.getElementById("tot").style.display = 'block';
      insertRowsInTable();
    });
  }



  if (userAnswerMap.get(queNo) != undefined) {
    var optionsRadioGroup = document.getElementsByName("ansOption");
    optionsRadioGroup[userAnswerMap.get(queNo)].checked = true;
  }
  (document.getElementById("crtAnsDiv")).style.display = 'none';
  $("#quesId").html(jsonQuestionObject[queNo].que);
  $("#opt1Id").html(jsonQuestionObject[queNo].options[0]);
  $("#opt2Id").html(jsonQuestionObject[queNo].options[1]);
  $("#opt3Id").html(jsonQuestionObject[queNo].options[2]);
  $("#opt4Id").html(jsonQuestionObject[queNo].options[3]);

}

function previousQuestion() {

    var optionsRadioGroup = document.getElementsByName("ansOption");
    for (var i = 0; i < optionsRadioGroup.length; i++) {
      if (optionsRadioGroup[i].checked == true) {
        userAnswerMap.set(queNo, i);
      }
    }
    queNo--;
    if (queNo == 0) {
      document.getElementById("btnPrev").disabled = true;
    } else {
      document.getElementById("btnPrev").disabled = false;
      document.getElementById("btnNext").value = "Next";
    }
    clearAllRadioBtns();

  if (userAnswerMap.get(queNo) != undefined) {
    var optionsRadioGroup = document.getElementsByName("ansOption");
    optionsRadioGroup[userAnswerMap.get(queNo)].checked = true;
  }
  (document.getElementById("crtAnsDiv")).style.display = 'none';
    $("#quesId").html(jsonQuestionObject[queNo].que);
    $("#opt1Id").html(jsonQuestionObject[queNo].options[0]);
    $("#opt2Id").html(jsonQuestionObject[queNo].options[1]);
    $("#opt3Id").html(jsonQuestionObject[queNo].options[2]);
    $("#opt4Id").html(jsonQuestionObject[queNo].options[3]);
}

function showAnswer() {
  (document.getElementById("crtAnsDiv")).style.display = 'block';
  $("#crtAns").html("Correct Answer : " + jsonQuestionObject[queNo].ans);
}

function clearAllRadioBtns() {
  var optionsRadioGroup = document.getElementsByName("ansOption");
  for (var i = 0; i < optionsRadioGroup.length; i++) {
    if (optionsRadioGroup[i].checked == true) {
      optionsRadioGroup[i].checked = false;
    }
  }
}

function insertRowsInTable() {
  var table = document.getElementById("resultTable");
  for (var i = 0; i < totalque; i++) {
    var row = table.insertRow(i + 1);
    for (var j = 0; j < 3; j++) {
      var cell = row.insertCell(j);
      if (j == 0) {
        cell.innerHTML = i + 1;
      }
      if (j == 1) {
        cell.innerHTML = jsonQuestionObject[i].options[userAnswerMap.get(i)];
      }
      if (j == 2) {
        if (jsonQuestionObject[i].options[userAnswerMap.get(i)] == jsonQuestionObject[i].ans) {
          cell.innerHTML = "1 Mark";
          row.className = "alert alert-success";
          score++;
        } else {
          cell.innerHTML = "0 Mark";
          row.className = "alert alert-danger";
        }
      }
    }
  }
  showUserResult();
}

function showUserResult() {
  var uResult = (score / totalque) * 100;
  if (uResult >= 70) {
    $("#resultPnl").removeClass("bg-primary").addClass("alert-success");
    (document.getElementById("usrRemark")).innerHTML = "Excellent Job !! You are doing Great";
  } else if (uResult < 70 && uResult >= 50) {
    $("#resultPnl").removeClass("bg-primary").addClass("alert-warning");
    (document.getElementById("usrRemark")).innerHTML = "Good Job !! You can do Better";
  } else if (uResult < 50) {
    $("#resultPnl").removeClass("bg-primary").addClass("alert-danger");
    (document.getElementById("usrRemark")).innerHTML = "Upsss !! You need Serious Improvement";
  }

  (document.getElementById("ttlQuestion")).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total number of Questions : " + totalque;
  (document.getElementById("uncorrAns")).innerHTML = "Total number of Wrong Answer : " + (totalque - score);
  (document.getElementById("corrAns")).innerHTML = "Total number of Correct Answer : " + score;
  $.ajax({
    type: 'post',
    url: 'average.php',
    data: {
      updateYourScore: uResult
    },

    success: function(response) {
      $('#usrResult').html(response);
    }
  });


}
