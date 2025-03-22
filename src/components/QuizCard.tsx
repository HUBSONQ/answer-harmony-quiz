
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Brain, AlertCircle } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import OpenAIKeyInput from './OpenAIKeyInput';

const QuizCard: React.FC = () => {
  const { state, selectAnswer, revealAnswer, nextQuestion, toggleAutoAnswer } = useQuiz();
  const { 
    questions, 
    currentQuestionIndex, 
    selectedAnswerIndex, 
    isAnswerRevealed, 
    isAnswerCorrect, 
    isQuizComplete,
    autoAnswerMode,
    aiThinking,
    aiError
  } = state;

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (index: number) => {
    if (isAnswerRevealed || autoAnswerMode) return;
    selectAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswerIndex === null || autoAnswerMode) return;
    revealAnswer();
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  if (!currentQuestion || isQuizComplete) return null;

  // Determine if the error is related to quota limits
  const isQuotaError = aiError?.includes('usage limit') || aiError?.includes('quota');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism rounded-2xl p-6 w-full max-w-xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-primary">
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">30s</span>
            </div>
            <button 
              onClick={toggleAutoAnswer}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                autoAnswerMode 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Brain className="w-3 h-3 mr-1" />
              {autoAnswerMode ? 'AI: ON' : 'AI: OFF'}
            </button>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-1">{currentQuestion.question}</h3>
      </div>

      {aiError && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`${isQuotaError ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'} p-4 rounded-xl mb-4 flex items-start gap-2`}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{isQuotaError ? 'API Quota Exceeded' : 'AI Error'}</p>
            <p className="text-sm">{aiError}</p>
            <div className="mt-2">
              <OpenAIKeyInput />
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswerClick(index)}
            className={`answer-option w-full text-left p-4 rounded-xl
                      ${selectedAnswerIndex === index ? 'selected' : ''}
                      ${isAnswerRevealed && index === currentQuestion.correctAnswerIndex ? 'correct' : ''}
                      ${isAnswerRevealed && selectedAnswerIndex === index && index !== currentQuestion.correctAnswerIndex ? 'incorrect' : ''}
                      ${aiThinking ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isAnswerRevealed || autoAnswerMode || aiThinking ? 1 : 1.01 }}
            whileTap={{ scale: isAnswerRevealed || autoAnswerMode || aiThinking ? 1 : 0.99 }}
            disabled={isAnswerRevealed || autoAnswerMode || aiThinking}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>

              {isAnswerRevealed && index === currentQuestion.correctAnswerIndex && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
              
              {isAnswerRevealed && selectedAnswerIndex === index && index !== currentQuestion.correctAnswerIndex && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {isAnswerRevealed && currentQuestion.explanation && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-accent p-4 rounded-xl mb-6"
        >
          <h4 className="font-medium mb-1">Explanation:</h4>
          <p className="text-muted-foreground text-sm">{currentQuestion.explanation}</p>
        </motion.div>
      )}

      {aiThinking && (
        <div className="flex items-center justify-center py-3 mb-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-3 text-sm font-medium">ChatGPT is thinking...</span>
        </div>
      )}

      <div className="flex justify-end">
        {!isAnswerRevealed ? (
          <motion.button
            onClick={handleCheckAnswer}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all
                      ${selectedAnswerIndex !== null && !autoAnswerMode && !aiThinking
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            whileHover={{ scale: selectedAnswerIndex !== null && !autoAnswerMode && !aiThinking ? 1.02 : 1 }}
            whileTap={{ scale: selectedAnswerIndex !== null && !autoAnswerMode && !aiThinking ? 0.98 : 1 }}
            disabled={selectedAnswerIndex === null || autoAnswerMode || aiThinking}
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
            onClick={handleNextQuestion}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next Question
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizCard;
