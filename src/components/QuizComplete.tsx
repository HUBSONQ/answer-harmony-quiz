
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

const QuizComplete: React.FC = () => {
  const { state, resetQuiz } = useQuiz();
  const { score, totalQuestions } = state;
  
  const percentage = (score / totalQuestions) * 100;
  
  let message = '';
  let color = '';
  
  if (percentage >= 80) {
    message = 'Excellent! You're a quiz master!';
    color = 'text-green-600';
  } else if (percentage >= 60) {
    message = 'Good job! You know your stuff!';
    color = 'text-blue-600';
  } else if (percentage >= 40) {
    message = 'Not bad! Keep learning!';
    color = 'text-yellow-600';
  } else {
    message = 'Room for improvement. Try again!';
    color = 'text-red-600';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-morphism rounded-2xl p-8 w-full max-w-xl mx-auto text-center"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-primary/10 mb-6"
      >
        <Trophy className="w-10 h-10 text-primary" />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-2"
      >
        Quiz Complete!
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-lg font-medium mb-6 ${color}`}
      >
        {message}
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center justify-center mb-8"
      >
        <div className="text-5xl font-bold mb-2 text-primary">
          {score}/{totalQuestions}
        </div>
        <p className="text-muted-foreground">
          You got {score} out of {totalQuestions} questions correct
        </p>
      </motion.div>
      
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all"
        onClick={resetQuiz}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </motion.button>
    </motion.div>
  );
};

export default QuizComplete;
