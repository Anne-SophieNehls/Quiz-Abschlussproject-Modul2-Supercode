# Quiz App Deutsch

Wir machen ein Projekt mit leichten und schweren Fragen in Deutsch und Englisch von Api. Unsere HTML-Datei ist wie folgt.

```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quiz</title>
    <script type="module" src="/src/main.ts" defer></script>
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <section>
      <div id="start-screen">
        <h1>Quiz des Tages, Yeah</h1>
        <form id="form" action="">
          <label for="userInput">Gib deinen Namen ein:</label>
          <input type="text" id="userInput" name="userInput" />
          <br />
          <label for="difficulty"
            >Schwierigkeitsgrad und Language wählen:</label
          >
          <select id="difficulty">
            <optgroup label="Deutsch">
              <option id="leicht" value="leicht">Leicht</option>
              <option id="schwer" value="schwer">Schwer</option>
            </optgroup>
            <optgroup label="English">
              <option id="easy" value="easy">Easy</option>
              <option id="hard" value="hard">Hard</option>
            </optgroup>
          </select>
          <br />
          <input type="submit" id="startBtn" value="Los geht's!" />
        </form>
      </div>
      <div id="client-info"></div>
      <div id="question-div">
        <div id="answers-div"></div>
      </div>
    </section>
  </body>
</html>
```

Dieser Code erstellt die Grundstruktur für eine Quiz-Anwendung.

- **Titel und Meta-Informationen:** Die Seitensprache ist auf Türkisch eingestellt, Zeichensatz und Viewport sind definiert. Außerdem sind Verknüpfungen zu einer TypeScript-Datei (main.ts) und einer CSS-Datei (style.css) hinzugefügt.
- **Startbildschirm (start-screen):** Enthält ein Formular, das den Benutzer auffordert, einen Namen einzugeben. Zusätzlich gibt es ein Dropdown-Menü zur Auswahl des Schwierigkeitsgrads und der Sprache.
- **Schwierigkeitsgrade:** Für Deutsch gibt es die Optionen "Leicht" und "Schwer", für Englisch "Easy" und "Hard".
- **Start-Button:** Ein Button mit der Aufschrift "Los geht's!" startet das Quiz.
- **Weitere Abschnitte:** Es gibt einen "client-info" div zum Anzeigen von Benutzerinformationen sowie "question-div" und "answers-div" Abschnitte zum Anzeigen von Fragen und Antworten.

Diese Struktur ermöglicht es dem Benutzer, seinen Namen einzugeben, einen Schwierigkeitsgrad und eine Sprache auszuwählen und bietet dann einen Bereich zur Anzeige der Quizfragen.

```tsx
interface Question {
  question: string;
  correct: number;
  answers: string[];
}

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
```

Dieser Codeausschnitt zeigt einen Teil einer TypeScript-Datei.

- **Question-Schnittstelle:** Definiert die Struktur eines Fragenobjekts. Jede Frage enthält einen Text, den Index der richtigen Antwort und Antwortoptionen.
- **Variablen:** Es wurden ein Array für Fragen, ein Index für die aktuelle Frage und eine Variable für den Punktestand definiert.

**DOM-Elemente:** Referenzen auf verschiedene HTML-Elemente wurden erstellt. Zum Beispiel:

- Eingabefeld für den Benutzernamen
- Auswahlfeld für den Schwierigkeitsgrad
- Formular
- Startbildschirm
- Bereich für Benutzerinformationen
- Bereiche für Antworten und Fragen

Dieser Code stellt die grundlegende Struktur der Quiz-Anwendung bereit und ermöglicht den Zugriff auf Benutzeroberflächenelemente. Er bereitet die notwendige Infrastruktur für Fragen, Benutzerinteraktionen und die Quiz-Logik vor.

```tsx
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
```

Dieser Codeabschnitt enthält die notwendigen Operationen zum Starten eines Quiz und zum Anzeigen der ersten Frage.

- Beim Absenden des Formulars (submit-Event) wird das Standardverhalten verhindert und die Funktion startQuiz() aufgerufen.
- clientInfoDiv und questionDiv sind anfangs ausgeblendet.
- Die Funktion startQuiz() ist asynchron definiert. Diese Funktion:
- Erfasst den Benutzernamen und den gewählten Schwierigkeitsgrad.
- Erstellt eine API-URL basierend auf dem gewählten Schwierigkeitsgrad.
- Ruft die Fragen mittels fetch() von der API ab.
- Bei Erfolg werden die Fragen in das questions-Array geladen, Punktzahl und Fragenindex zurückgesetzt.
- Aktualisiert die Benutzeroberfläche: Blendet den Startbildschirm aus und zeigt die Fragen- und Benutzerinformationsbereiche an.
- Zeigt eine Begrüßungsnachricht für den Benutzer an.
- Ruft die Funktion showQuestion() auf, um die erste Frage anzuzeigen (diese Funktion ist im gezeigten Code nicht enthalten).

Im Fehlerfall wird eine Fehlermeldung in der Konsole ausgegeben.

```tsx
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

  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.addEventListener("click", () => checkAnswer(answer));
    answersDiv.appendChild(button);
  });
}
```

Dieser Codeabschnitt definiert die Funktion showQuestion(), die verwendet wird, um Fragen in einer Quiz-Anwendung anzuzeigen. Hier sind die Schritte, die die Funktion ausführt:

- Sie ruft die aktuelle Frage aus dem questions-Array ab.
- Sie erstellt ein h3-Element, das den Fragetext enthält.
- Sie löscht vorherige Antworten und zeigt die neue Fragennummer an.
- Für jede Antwortoption erstellt sie einen Button:
  - Sie setzt den Buttontext als Antwort.
  - Sie fügt einen Event-Listener hinzu, der die Funktion checkAnswer() aufruft, wenn der Button geklickt wird.
  - Sie fügt den Button dem answersDiv hinzu.

Diese Funktion wird jedes Mal aufgerufen, wenn eine neue Frage angezeigt wird, und präsentiert dem Benutzer die aktuelle Frage und die Antwortmöglichkeiten.

```tsx
function checkAnswer(selectedAnswer: string) {
  const currentQuestion = questions[currentQuestionIndex];
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
```

Dieser Codeabschnitt definiert die Funktion checkAnswer() für eine Quiz-Anwendung, die die vom Benutzer ausgewählte Antwort überprüft. Hier sind die Schritte, die die Funktion ausführt:

- Sie nimmt die ausgewählte Antwort des Benutzers und die aktuelle Frage entgegen.
- Wenn die ausgewählte Antwort richtig ist:
  - Zeigt sie die Meldung "Richtig!" an und erhöht den Punktestand.
- Wenn die ausgewählte Antwort falsch ist:
  - Zeigt sie die Meldung "Falsch!" und die korrekte Antwort an.
- Sie fügt das Ergebnis dem Bildschirm hinzu und geht zur nächsten Frage über.
- Wenn es weitere Fragen gibt:
  - Zeigt sie nach einer Wartezeit von 2 Sekunden die nächste Frage an.
- Wenn alle Fragen beantwortet wurden:
  - Ruft sie die Funktion showFinalResult() auf, um das Endergebnis anzuzeigen.

Diese Funktion bewertet die Antwort des Benutzers, gibt Feedback und steuert den Ablauf des Quiz.

```tsx
function showFinalResult() {
  questionDiv.innerHTML = `<h2>Quiz beendet!</h2><p>Ihr Ergebnis: ${score} von ${questions.length}</p>`;
}
```

Natürlich, ich kann diesen Code erklären. Dieser Codeabschnitt definiert die Funktion `showFinalResult()`, die das Endergebnis in einer Quiz-Anwendung anzeigt. Hier sind die Aktionen, die die Funktion ausführt:

- Die Funktion ändert den Inhalt des `questionDiv`-Elements, um das Ende des Quiz und das Ergebnis des Benutzers anzuzeigen.
- Als Inhalt wird ein HTML-String verwendet. Dieser String enthält Folgendes:
  - Eine `h2`-Überschrift: "Quiz beendet!"
  - Einen `p`-Absatz: Zeigt die Punktzahl des Benutzers an
- Die Punktzahl wird als `${score} von ${questions.length}` angezeigt. Dies zeigt die Anzahl der vom Benutzer korrekt beantworteten Fragen (`score`) und die Gesamtzahl der Fragen (`questions.length`).

Diese Funktion wird am Ende des Quiz aufgerufen und zeigt dem Benutzer seine endgültige Punktzahl an. Dadurch kann der Benutzer seine Leistung im Quiz sehen.
Unser Schlachtplan zu dem Project in einer figmadatei ist hier zu finden:
https://www.figma.com/board/jcTrkm9QenzthWxLg01XX4/Quiz-Projekt-Plan?node-id=1-313&t=qQCgcdVT1sAKlKiy-1
