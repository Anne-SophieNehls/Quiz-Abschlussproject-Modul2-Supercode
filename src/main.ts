import { Question, QuizData } from "./interfaces/IQuestions";

let questions: Question[] = [];
let currentQuestionIndex = 0;
let score = 0;

document.getElementById('startBtn')!.addEventListener('click', startQuiz);
document.getElementById('next-question')!.addEventListener('click', showNextQuestion);

async function startQuiz() {
    const difficulty = (document.getElementById('difficulty') as HTMLSelectElement).value;
    const language = (document.getElementById('language') as HTMLSelectElement).value;

    const apiUrl = `https://vz-wd-24-01.github.io/typescript-quiz/questions/${difficulty}.json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }
        const data: QuizData = await response.json();
        questions = data.questions;
        currentQuestionIndex = 0;
        score = 0;
        document.getElementById('question-div')!.style.display = 'block';
        showQuestion();
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const questionElement = document.getElementById('question-div')!;
  const answersElement = document.getElementById('answer-div')!;
  const resultElement = document.getElementById('result')!;
  const nextQuestionButton = document.getElementById('next-question')!;

  questionElement.innerHTML = currentQuestion.question;
  answersElement.innerHTML = '';
  resultElement.innerHTML = '';
  nextQuestionButton.style.display = 'none';

  const answers = [currentQuestion.correctAnswer, ...currentQuestion.answers];
  answers.sort(() => Math.random() - 0.5);

  answers.forEach(answer => {
      const button = document.createElement('button');
      button.innertext = answer;
      button.addEventListener('click', () => checkAnswer(answer));
      answersElement.appendChild(button);
  });
}
function checkAnswer(selectedAnswer: string) {
  const currentQuestion = questions[currentQuestionIndex];
  const resultElement = document.getElementById('result')!;
  const nextQuestionButton = document.getElementById('next-Question')!;

  if (selectedAnswer === currentQuestion.correctAnswer) {
      resultElement.innerHTML = 'Richtig!';
      score++;
  } else {
      resultElement.innerHTML = 'Falsch! Die richtige Antwort ist: ' + currentQuestion.correctAnswer;
  }

  nextQuestionButton.style.display = 'block';
}

function showNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
      showQuestion();
  } else {
      showFinalResult();
  }
}

function showFinalResult() {
  const quizContainer = document.getElementById('quizContainer')!;
  quizContainer.innerHTML = `<h2>Quiz beendet!</h2><p>Ihr Ergebnis: ${score} von ${questions.length}</p>`;
}