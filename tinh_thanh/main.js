let name;
let information;
let progress;
let firstIdQuestion = 15;
let lastIdQuestion = 24;
let idTest = 'Tên tỉnh thành';
let DataQuestion;
let idQuestion = 0;
let score = 0;
let lengthQuestion = lastIdQuestion - firstIdQuestion + 1;
let timeCount;

function getIP(json) {
  information = json.ip;
}

function getDataQuestion() {
  url = `https://script.google.com/macros/s/AKfycbyra7Wgqk_KBmX9gPg4Jm68zRNHAbA3RYSzqfR63sVy8eRjFSH8G_ubZ7KYkbojnsTd4A/exec?action=getData`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document.querySelector('.question-loading').classList.add('activeNone');

      DataQuestion = data;

      listTrueAnswer = DataQuestion.map((item) => item['answer']);

      // listVietnameseAnswer = DataQuestion.map((item) => item['translate']);
      arrayListQuestion = listTrueAnswer.map((item) => item.split(' ').join('').split(''));

      arrayListQuestion.map((item) => {
        const checkItem = [...item];

        shuffle(item);

        while (checkItem.join('') === item.join('')) {
          shuffle(item);
        }
        return item;
      });

      startQuiz(arrayListQuestion[firstIdQuestion]);
    });
}

function handleQuestionButton(e) {
  document.querySelector('.check-result-button').classList.remove('hideActive');
  document.querySelector(`#${e.target.id}`).classList.add('hideButton');
  arrayAnswer.push(e.target.innerText);

  selectAnswer(arrayAnswer);
}
function selectAnswer(listAnswer) {
  showAnswer = listAnswer.map(
    (item, id) =>
      ` <div class="answer-button" id="answer-id-${id}" onclick="handleAnswerQuestionButton(event)"> ${item} </div>`
  );
  document.querySelector('.answer-show').innerHTML = showAnswer.join(' ');
}

function handleAnswerQuestionButton(e) {
  const valueQuestion = e.target.innerText;

  const idDelete = e.target.id.slice(10);
  arrayAnswer.splice(idDelete, 1);
  selectAnswer(arrayAnswer);

  const lengtAnswer = arrayListQuestion[idQuestion + firstIdQuestion].length;

  for (i = 0; i < lengtAnswer; i++) {
    if (
      document.getElementById(`question-id-${i}`).innerText === valueQuestion &&
      document.getElementById(`question-id-${i}`).classList.contains('hideButton')
    ) {
      document.getElementById(`question-id-${i}`).classList.remove('hideButton');
      break;
    }
  }
}

function startQuiz(question) {
  Time(5);

  arrayAnswer = [];
  const newIdQuestion = idQuestion + 1;
  progress = (newIdQuestion / lengthQuestion) * 100;

  document.querySelector('.progress-percent').style.width = `${progress}%`;

  const showQuesion = question.map(
    (eachQuestion, id) =>
      `<div class="question-button" id="question-id-${id}" onclick="handleQuestionButton(event)">${eachQuestion}</div>`
  );
  document.querySelector('.question-show').innerHTML = showQuesion.join(' ');
}

function handleCheck() {
  clearInterval(timeCount);
  document.querySelector('.answer').classList.add('hidePointer');

  if (
    document.querySelector('.answer-show').innerText.split(' ').join('') ===
    listTrueAnswer[idQuestion + firstIdQuestion].split(' ').join('')
  ) {
    score = score + 1;

    document.querySelector('.show-result-answer').classList.remove('false-result');
    document.querySelector('.show-result-answer').classList.add('true-result');
    document.querySelector('.show-answer').innerHTML = ` Đáp án:  ${listTrueAnswer[idQuestion + firstIdQuestion]}`;
    // document.querySelector('.show-vietnamese-answer').innerHTML = listVietnameseAnswer[idQuestion + firstIdQuestion];
    document.querySelector('.show-result-answer-true').classList.remove('activeNone');

    document.querySelector('.check-result').classList.add('activeNone');
    document.querySelector('.check-true').classList.remove('activeNone');
  } else {
    document.querySelector('.show-result-answer-false').classList.remove('activeNone');
    document.querySelector('.show-result-answer').classList.remove('true-result');
    document.querySelector('.show-result-answer').classList.add('false-result');
    document.querySelector('.show-answer').innerHTML = ` Đáp án:  ${listTrueAnswer[idQuestion + firstIdQuestion]}`;
    // document.querySelector('.show-vietnamese-answer').innerHTML = listVietnameseAnswer[idQuestion + firstIdQuestion];

    document.querySelector('.check-result').classList.add('activeNone');
    document.querySelector('.check-false').classList.remove('activeNone');
  }
}

function handleNext() {
  document.querySelector('.show-result-answer-true').classList.add('activeNone');
  document.querySelector('.show-result-answer-false').classList.add('activeNone');
  document.querySelector('.show-result-answer').classList.remove('false-result');
  document.querySelector('.show-result-answer').classList.remove('true-result');
  document.querySelector('.answer').classList.remove('hidePointer');
  document.querySelector('.check-result-button').classList.add('hideActive');
  document.querySelector('.answer-show').innerHTML = '';

  document.querySelector('.check-result').classList.remove('activeNone');
  document.querySelector('.check-true').classList.add('activeNone');
  document.querySelector('.check-false').classList.add('activeNone');
  idQuestion = idQuestion + 1;
  if (idQuestion < lengthQuestion) {
    startQuiz(arrayListQuestion[firstIdQuestion + idQuestion]);
  } else {
    endgame();
  }
}

function endgame() {
  document.querySelector('.app').classList.add('check-end');
  document.querySelector('.endgame').classList.remove('check-end');
  document.querySelector('.endgame-idTest').innerHTML = `${idTest}`;
  document.querySelector('.endgame-nameUser').innerHTML = `${name}`;
  document.querySelector('.endgame-score').innerHTML = `${score}/${lengthQuestion}`;

  PostDataUser();
}

function PostDataUser() {
  const urlPost =
    'https://script.google.com/macros/s/AKfycbwdRidXHM1G-gpQ71cZkzQY3rpPSbv-j37bQ45WMS7_xhCJA7mNKiJzsoUx0zFYKiX9Iw/exec?action=addUser';

  const dataUser = {
    Name: `${name}`,
    Score: `${score}/${lengthQuestion}`,
    Information: `${idTest} ${information}`,
  };
  fetch(urlPost, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(dataUser), // body data type must match "Content-Type" header
  });
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function enterSubmit(e) {
  if (e.keyCode === 13) {
    submitName();
  }
}
function submitName() {
  name = document.querySelector('.name-input').value;

  getDataQuestion();
  if (name.length < 3) {
    document.querySelector('.name-check').classList.remove('check-input');
  } else {
    document.querySelector('.app').classList.remove('check-end');
    document.querySelector('.name').classList.add('check-end');
  }
}
function focusName() {
  document.querySelector('.name-check').classList.add('check-input');
  document.querySelector('.name-input').value = '';
}

function Time(setTimeCount) {
  let startTime = 0;
  let showTime;
  timeCount = setInterval(function () {
    if (startTime <= setTimeCount) {
      showTime = setTimeCount - startTime;
      if (showTime > 9) {
        showTime = showTime;
      } else {
        showTime = `0${showTime}`;
      }
      document.querySelector('.time-count').innerHTML = showTime;

      startTime = startTime + 1;
    } else {
      clearInterval(timeCount);
      handleCheck();
    }
  }, 1000);
}
