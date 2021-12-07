import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmQDYmuecPbLe9v5SrsVxQAqsOaCVjMkg",
  authDomain: "nkj-login.firebaseapp.com",
  projectId: "nkj-login",
  storageBucket: "nkj-login.appspot.com",
  messagingSenderId: "98244104367",
  appId: "1:98244104367:web:dabf51724d7483ada5445a",
  measurementId: "G-2GK50TGJ53",
};

const $card = $(".flashcard");
const definition = document.querySelector(".definition");
const meaning = document.querySelector(".meaning");
const current_number = document.querySelector(".current-display");
const current_number_progresses = document.querySelectorAll(
  ".current-display-progress"
);
const progress_bars = document.querySelectorAll(".progress-bar");
const shuffleButton = document.querySelector(".flashcards-bot")

const alphabet_definition = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
  "た",
  "ち",
  "つ",
  "て",
  "と",
  "な",
  "に",
  "ぬ",
  "ね",
  "の",
  "は",
  "ひ",
  "ふ",
  "へ",
  "ほ",
  "ま",
  "み",
  "む",
  "め",
  "も",
  "や",
  "ゆ",
  "よ",
  "ら",
  "り",
  "る",
  "れ",
  "ろ",
  "わ",
  "を",
  "ん",
];

const alphabet_meaning = [
  "a",
  "i",
  "u",
  "e",
  "o",
  "ka",
  "ki",
  "ku",
  "ke",
  "ko",
  "sa",
  "shi",
  "su",
  "se",
  "so",
  "ta",
  "chi",
  "tsu",
  "te",
  "to",
  "na",
  "ni",
  "nu",
  "ne",
  "no",
  "ha",
  "hi",
  "fu",
  "he",
  "ho",
  "ma",
  "mi",
  "mu",
  "me",
  "mo",
  "ya",
  "yu",
  "yo",
  "ra",
  "ri",
  "ru",
  "re",
  "ro",
  "wa",
  "wo",
  "n",
];

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const uid = localStorage.getItem("loggedIn");
var userRef, userSnap;
var current_display = 1, current_index = 0, shuffleIndex = 0;
var shuffleCount = 0;

const left_arrow = document.querySelector(".left-arrow");
const right_arrow = document.querySelector(".right-arrow");

function flip() {
  $card.toggleClass("is-active");
}

async function getUser() {
  if (uid != null) {
    userRef = doc(db, "users", uid);
    userSnap = await getDoc(userRef);
    current_index = userSnap.data()["current index"] || 0;
    current_display = userSnap.data()["current display"] || 1;
  }
}

function updateProgress() {
  current_number.innerHTML = current_display;
  current_number_progresses.forEach(
    (progress) => (progress.innerHTML = current_display)
  );
  progress_bars.forEach((bar) => (bar.value = current_display));
}

function updateMainFlashCard() {
  definition.innerHTML = alphabet_definition[current_index];
  meaning.innerHTML = alphabet_meaning[current_index];
}

// function updateMainFlashCard() {
//   updateCard(alphabet_definition, alphabet_meaning);
// }

function saveProgress() {
  if (uid != null) {
    setDoc(
      userRef,
      {
        "current index": current_index,
        "current display": current_display,
      },
      { merge: true }
    );
  }
}

function setCardStyle(time) {
  definition.style.transition = `all ${time}s ease`;
  meaning.style.transition = `all ${time}s ease`;
}

function decrease() {
  if (current_index == 0) {
    return;
  }
  if ($card.is(".is-active")) {
    flip();
  }
  setCardStyle(0);
  current_index--;
  current_display--;
  updateProgress();
  updateMainFlashCard();
  saveProgress();
  setTimeout(function () {
    setCardStyle(0.6);
  }, 100);
}

function increase() {
  if (current_index == 45) {
    return;
  }
  setCardStyle(0);
  if ($card.is(".is-active")) {
    flip();
  }
  current_index++;
  current_display++;
  updateProgress();
  updateMainFlashCard();
  saveProgress();
  setTimeout(function () {
    setCardStyle(0.6);
  }, 100);
}

document.body.onkeyup = function(e){
  if(e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 40){
      flip()
  }
  else if (e.keyCode == 37) decrease();
  else if (e.keyCode == 39) increase();
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Create a consecutive array
function generateArray(N) {
  var array = [];
  for (let i = 0; i < N; i++) {
    array.push(i);
  }
  return array;
}

// Shuffle an array
function shuffleArray(random) {
  shuffleCount ++;
  var L = random.length;
  for (var i = 0; i < L; i++) {
  var j = randomIntFromInterval(0, L - 1);
  var b = random[j];
  random[j] = random[i];
  random[i] = b;
}
  return random;
}

let randomArray = [];

function shuffleFlashCard() {
  randomArray = shuffleArray(generateArray(46));
  shuffleIndex = 0;
  current_index = randomArray[shuffleIndex];
  current_display = current_index + 1;
  current_number.innerHTML = shuffleIndex + 1;
  current_number_progresses.forEach(
    (progress) => (progress.innerHTML = (shuffleIndex + 1))
  );
  progress_bars.forEach((bar) => (bar.value = (shuffleIndex + 1)));
  updateMainFlashCard();
  left_arrow.removeEventListener("click", decrease);
  right_arrow.removeEventListener("click", increase);
  left_arrow.addEventListener("click", decreaseShuffle);
  right_arrow.addEventListener("click", increaseShuffle);
}

function decreaseShuffle() {
  if (shuffleIndex == 0) {
    return;
  }
  if ($card.is(".is-active")) {
    flip();
  }
  setCardStyle(0);
  shuffleIndex --;
  current_index = randomArray[shuffleIndex];
  current_display = current_index + 1;
  current_number.innerHTML = shuffleIndex + 1;
  current_number_progresses.forEach(
    (progress) => (progress.innerHTML = shuffleIndex + 1)
  );
  progress_bars.forEach((bar) => (bar.value = shuffleIndex + 1));
  updateMainFlashCard();
  saveProgress();
  setTimeout(function () {
    setCardStyle(0.6);
  }, 100);
}

function increaseShuffle() {
  if (shuffleIndex == 45) {
    return;
  }
  setCardStyle(0);
  if ($card.is(".is-active")) {
    flip();
  }
  shuffleIndex ++;
  current_index = randomArray[shuffleIndex];
  current_display = current_index + 1;
  current_number.innerHTML = shuffleIndex;
  current_number_progresses.forEach(
    (progress) => (progress.innerHTML = shuffleIndex + 1)
  );
  progress_bars.forEach((bar) => (bar.value = shuffleIndex + 1));
  updateMainFlashCard();
  saveProgress();
  setTimeout(function () {
    setCardStyle(0.6);
  }, 100);
}

function load() {
  clickDropDown();
  clickOverlay();

  $(".flashcard").click(flip);

  left_arrow.addEventListener("click", decrease);
  right_arrow.addEventListener("click", increase);
  shuffleButton.addEventListener("click", shuffleFlashCard);

  getUser()
    .then(() => {
      updateProgress();
      updateMainFlashCard();
    });
}

window.onload = load();
