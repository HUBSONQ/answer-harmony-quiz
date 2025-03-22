
import React from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { motion } from 'framer-motion';

const QuizProgress: React.FC = () => {
  const { state } = useQuiz();
  const { currentQuestionIndex, totalQuestions, score } = state;
  
  const progressPercent = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div className="mb-8 w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-medium">{score} correct</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;
