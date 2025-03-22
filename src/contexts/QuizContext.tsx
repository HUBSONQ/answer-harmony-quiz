
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { QuizState, QuizAction, QuizQuestion } from '../types/quiz';
import { toast } from 'sonner';
import { OpenAIService } from '../services/openai';

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswerIndex: null,
  isAnswerRevealed: false,
  isAnswerCorrect: null,
  score: 0,
  totalQuestions: 0,
  isQuizComplete: false,
  loading: false,
  autoAnswerMode: false,
  aiThinking: false,
  aiError: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT_ANSWER':
      return {
        ...state,
        selectedAnswerIndex: action.payload,
      };
    case 'REVEAL_ANSWER':
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = state.selectedAnswerIndex === currentQuestion.correctAnswerIndex;
      
      if (isCorrect) {
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect answer!');
      }
      
      return {
        ...state,
        isAnswerRevealed: true,
        isAnswerCorrect: isCorrect,
        score: isCorrect ? state.score + 1 : state.score,
      };
    case 'NEXT_QUESTION':
      const nextIndex = state.currentQuestionIndex + 1;
      const isComplete = nextIndex >= state.questions.length;
      
      if (isComplete) {
        toast(`Quiz complete! Your score: ${state.score}/${state.totalQuestions}`);
      }
      
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        selectedAnswerIndex: null,
        isAnswerRevealed: false,
        isAnswerCorrect: null,
        isQuizComplete: isComplete,
        aiError: null,
      };
    case 'RESET_QUIZ':
      return {
        ...initialState,
        questions: state.questions,
        totalQuestions: state.questions.length,
        autoAnswerMode: state.autoAnswerMode, // Preserve auto-answer mode when resetting
      };
    case 'SET_QUESTIONS':
      return {
        ...initialState,
        questions: action.payload,
        totalQuestions: action.payload.length,
        autoAnswerMode: state.autoAnswerMode, // Preserve auto-answer mode
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'TOGGLE_AUTO_ANSWER':
      return {
        ...state,
        autoAnswerMode: !state.autoAnswerMode,
        aiError: null,
      };
    case 'SET_AI_THINKING':
      return {
        ...state,
        aiThinking: action.payload,
      };
    case 'SET_AI_ERROR':
      return {
        ...state,
        aiError: action.payload,
      };
    default:
      return state;
  }
}

interface QuizContextProps {
  state: QuizState;
  selectAnswer: (index: number) => void;
  revealAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  loadQuestions: () => Promise<void>;
  toggleAutoAnswer: () => void;
}

const QuizContext = createContext<QuizContextProps | null>(null);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Auto-answer effect - whenever a new question is shown in auto-answer mode
  useEffect(() => {
    if (state.autoAnswerMode && !state.isAnswerRevealed && state.questions.length > 0 && !state.isQuizComplete) {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      
      // Set AI thinking state to display loading indicator
      dispatch({ type: 'SET_AI_THINKING', payload: true });
      
      // Ask ChatGPT for the answer
      const getAIAnswer = async () => {
        try {
          // Check if we have an API key
          const apiKey = localStorage.getItem('openai_api_key');
          if (!apiKey) {
            dispatch({ type: 'SET_AI_ERROR', payload: 'OpenAI API key not found' });
            dispatch({ type: 'SET_AI_THINKING', payload: false });
            toast.error('OpenAI API key not found. Please set your API key.');
            return;
          }
          
          // Use OpenAI to get the answer
          const aiAnswerIndex = await OpenAIService.getAnswerForQuestion(
            currentQuestion.question,
            currentQuestion.options
          );
          
          // Auto-select the AI's answer
          dispatch({ type: 'SELECT_ANSWER', payload: aiAnswerIndex });
          
          // After a short delay, reveal the answer
          setTimeout(() => {
            dispatch({ type: 'REVEAL_ANSWER' });
            
            // After another delay, move to the next question
            setTimeout(() => {
              dispatch({ type: 'NEXT_QUESTION' });
            }, 2000);
            
            // Reset AI thinking state
            dispatch({ type: 'SET_AI_THINKING', payload: false });
          }, 1000);
        } catch (error) {
          console.error('Error getting AI answer:', error);
          dispatch({ type: 'SET_AI_ERROR', payload: error instanceof Error ? error.message : 'Error connecting to OpenAI' });
          dispatch({ type: 'SET_AI_THINKING', payload: false });
          toast.error('Failed to get answer from ChatGPT');
        }
      };
      
      // Add a slight delay to make it look like it's "thinking"
      const timer = setTimeout(() => {
        getAIAnswer();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [state.autoAnswerMode, state.currentQuestionIndex, state.isAnswerRevealed, state.questions, state.isQuizComplete]);

  const selectAnswer = (index: number) => {
    dispatch({ type: 'SELECT_ANSWER', payload: index });
  };

  const revealAnswer = () => {
    dispatch({ type: 'REVEAL_ANSWER' });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const toggleAutoAnswer = () => {
    const newAutoAnswerMode = !state.autoAnswerMode;
    dispatch({ type: 'TOGGLE_AUTO_ANSWER' });
    
    if (newAutoAnswerMode) {
      toast.success('AI Auto-Answer mode enabled');
    } else {
      toast.info('AI Auto-Answer mode disabled');
    }
  };

  const loadQuestions = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // In a real app, this would fetch questions from an API
      // For now, we'll use our sample data
      const sampleQuestions: QuizQuestion[] = [
        {
          id: "1",
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correctAnswerIndex: 2,
          explanation: "Paris is the capital city of France."
        },
        {
          id: "2",
          question: "Which planet is known as the Red Planet?",
          options: ["Jupiter", "Mars", "Venus", "Saturn"],
          correctAnswerIndex: 1,
          explanation: "Mars appears red due to iron oxide (rust) on its surface."
        },
        {
          id: "3",
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Gl", "Au"],
          correctAnswerIndex: 3,
          explanation: "The chemical symbol Au comes from the Latin word for gold, 'aurum'."
        },
        {
          id: "4",
          question: "Which year did the Titanic sink?",
          options: ["1912", "1905", "1921", "1898"],
          correctAnswerIndex: 0,
          explanation: "The Titanic sank on April 15, 1912, during its maiden voyage."
        },
        {
          id: "5",
          question: "Who painted the Mona Lisa?",
          options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
          correctAnswerIndex: 1,
          explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519."
        }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({ type: 'SET_QUESTIONS', payload: sampleQuestions });
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error('Failed to load questions. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <QuizContext.Provider value={{ 
      state, 
      selectAnswer, 
      revealAnswer, 
      nextQuestion, 
      resetQuiz, 
      loadQuestions,
      toggleAutoAnswer 
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
