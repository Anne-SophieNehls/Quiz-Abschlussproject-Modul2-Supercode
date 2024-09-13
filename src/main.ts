import { Question, HighscoreEntry } from "./interfaces/IQuestions";

let questions: Question[] = [];
let currentQuestionIndex = 0;
let score = 0;
const userNameInput = document.getElementById("userInput") as HTMLInputElement;
const difficultySelect = document.getElementById(
  "difficulty"
) as HTMLSelectElement;
//const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const form = document.getElementById("form") as HTMLFormElement;
const startScreen = document.getElementById("start-screen")!;
const clientInfoDiv = document.getElementById("client-info")!;
const answersDiv = document.getElementById("answers-div") as HTMLDivElement;
const questionDiv = document.getElementById("question-div") as HTMLDivElement;

form?.addEventListener("submit", (event) => {
  event.preventDefault(); // Verhindert das Standardverhalten des Formulars
  startQuiz();
});
clientInfoDiv.style.display = "none";
questionDiv.style.display = "none";
async function startQuiz() {
  const userName = userNameInput.value;
  const difficulty = difficultySelect.value;

  const apiUrl = `https://vz-wd-24-01.github.io/typescript-quiz/questions/${difficulty}.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok.");
    }
    questions = await response.json();
    currentQuestionIndex = 0;
    score = 0;
    clientInfoDiv.style.display = "block";
    startScreen.style.display = "none"; // Verstecke den Startbildschirm
    questionDiv.style.display = "block"; // Zeige die Fragen an
    clientInfoDiv.innerHTML = `<h2>Willkommen, ${userName}!</h2>`;
    showQuestion();
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const questionElement = document.createElement("h3");
  questionElement.innerText = currentQuestion.question;

  answersDiv.innerHTML = ""; // Leere vorherige Antworten
  const indexElement = document.createElement("p");
  indexElement.innerText = `Frage ${currentQuestionIndex + 1} von ${
    questions.length
  }`;
  //In HTML score
  const scoreElement = document.createElement("p");
  scoreElement.innerText = `Score: ${score}`;
  answersDiv.appendChild(scoreElement);

  answersDiv.appendChild(indexElement);
  answersDiv.appendChild(questionElement);

  const answers = currentQuestion.answers;
  // answers.sort(() => Math.random() - 0.5); // Mische die Antworten

  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.addEventListener("click", () => checkAnswer(answer));
    answersDiv.appendChild(button);
  });
}

function checkAnswer(selectedAnswer: string) {
  const currentQuestion = questions[currentQuestionIndex];
  console.log(currentQuestionIndex);
  const resultElement = document.createElement("div");

  if (selectedAnswer === currentQuestion.answers[currentQuestion.correct]) {
    resultElement.innerHTML = "Richtig!";

    score++;
  } else {
    resultElement.innerHTML =
      "Falsch! Die richtige Antwort ist: " +
      currentQuestion.answers[currentQuestion.correct];
  }

  answersDiv.appendChild(resultElement);
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    setTimeout(showQuestion, 2000); // Warte 2 Sekunden, bevor die nächste Frage angezeigt wird
  } else {
    showFinalResult();
  }
}


function saveHighscores(newHighscore: HighscoreEntry) {
  const storedHighscores: HighscoreEntry[] = JSON.parse(localStorage.getItem("highscores") || "[]");
  storedHighscores.push(newHighscore);

  storedHighscores.sort((a, b) => b.score - a.score);

  const maxHighscores = 10;
  storedHighscores.length = Math.min(storedHighscores.length, maxHighscores);

  localStorage.setItem("highscores", JSON.stringify(storedHighscores));
}

function showHighscores() {
  const storedHighscores: HighscoreEntry[] = JSON.parse(localStorage.getItem("highscores") || "[]");

  const highscoreList = document.createElement("ul");
  storedHighscores.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Platz ${index + 1}.  ${entry.name}: ${entry.score}`;
    highscoreList.appendChild(listItem);
    answersDiv.style.display = "none"

  });

  const highscoreContainer = document.getElementById("highscore-container");
  if (highscoreContainer) {
    highscoreContainer.innerHTML = "";
    highscoreContainer.appendChild(highscoreList);
  }
}

function showFinalResult() {

  const newHighscore: HighscoreEntry = {
    name: userNameInput.value,
    score: score,
  };
  saveHighscores(newHighscore);
  showHighscores();
}