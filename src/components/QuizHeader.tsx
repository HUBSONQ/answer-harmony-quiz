
import React from 'react';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <div className="inline-flex items-center justify-center space-x-2 mb-3">
        <Brain className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">QuizGenius</h1>
      </div>
      <p className="text-muted-foreground max-w-md mx-auto">
        Test your knowledge with our AI-powered quiz. Select the correct answer for each question.
      </p>
    </motion.div>
  );
};

export default QuizHeader;
