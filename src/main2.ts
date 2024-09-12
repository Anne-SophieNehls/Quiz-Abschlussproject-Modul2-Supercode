import { Question } from "./interfaces/IQuestions";

async function fetchQuestions(difficulty: string): Promise<Question[]> {
    const url = `https://vz-wd-24-01.github.io/typescript-quiz/questions/${difficulty}.json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Netzwerkfehler: ' + response.statusText);
    }

    const data: Question[] = await response.json();
    return data;
}

let currentQuestionIndex = 0;
let score = 0;
let questions: Question[] = [];

document.getElementById('startBtn')?.addEventListener('click', async () => {
    const difficulty = (document.getElementById('difficulty') as HTMLSelectElement).value;
    const language = (document.getElementById('language') as HTMLSelectElement).value;

    try {
        questions = await fetchQuestions(difficulty);
        currentQuestionIndex = 0;
        score = 0;
        document.getElementById('quiz-container')!.style.display = 'none';
        document.getElementById('question-container')!.style.display = 'block';
        showQuestion();
    } catch (error) {
        console.error(error);
        alert('Fehler beim Laden der Fragen.');
    }
});

function showQuestion() {
    const questionElement = document.getElementById('question')!;
    const answersElement = document.getElementById('answer-div')!;
    answersElement.innerHTML = '';

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.addEventListener('click', () => selectAnswer(answer));
        answersElement.appendChild(button);
    });
}

function selectAnswer(answer: string) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
        score++;
        alert('Richtig!');
    } else {
        alert('Falsch! Die richtige Antwort ist: ' + currentQuestion.correctAnswer);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    document.getElementById('question-container')!.style.display = 'none';
    document.getElementById('result-container')!.style.display = 'block';
    document.getElementById('score')!.innerText = `Du hast ${score} von ${questions.length} richtig.`;
}

document.getElementById('restart-button')?.addEventListener('click', () => {
    document.getElementById('result-container')!.style.display = 'none';
    document.getElementById('quiz-container')!.style.display = 'block';
});