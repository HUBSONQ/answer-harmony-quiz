
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswerIndex: number | null;
  isAnswerRevealed: boolean;
  isAnswerCorrect: boolean | null;
  score: number;
  totalQuestions: number;
  isQuizComplete: boolean;
  loading: boolean;
  autoAnswerMode: boolean;
}

export type QuizAction =
  | { type: 'SELECT_ANSWER'; payload: number }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET_QUIZ' }
  | { type: 'SET_QUESTIONS'; payload: QuizQuestion[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_AUTO_ANSWER' };
