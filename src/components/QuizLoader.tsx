
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const QuizLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto py-12 glass-morphism rounded-2xl">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 0, 0, 0, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full mb-6"
      >
        <Brain className="h-10 w-10 text-primary" />
      </motion.div>
      
      <h3 className="text-xl font-semibold mb-3">Loading Quiz Questions</h3>
      <p className="text-muted-foreground text-center max-w-xs mb-6">
        Our AI is carefully selecting the perfect questions for you...
      </p>
      
      <div className="flex space-x-2">
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0
          }}
          className="w-3 h-3 rounded-full bg-primary"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.2
          }}
          className="w-3 h-3 rounded-full bg-primary"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.4
          }}
          className="w-3 h-3 rounded-full bg-primary"
        />
      </div>
    </div>
  );
};

export default QuizLoader;
