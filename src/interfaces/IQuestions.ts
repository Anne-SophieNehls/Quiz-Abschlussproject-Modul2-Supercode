export interface Question {
    question: string;
    answers: string[];
    correctAnswer: number;
  }  

  export interface QuizData {
    questions: Question[];
}