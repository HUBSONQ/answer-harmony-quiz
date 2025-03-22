
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuizProvider, useQuiz } from '../contexts/QuizContext';
import QuizCard from '../components/QuizCard';
import QuizProgress from '../components/QuizProgress';
import QuizComplete from '../components/QuizComplete';
import QuizLoader from '../components/QuizLoader';
import QuizHeader from '../components/QuizHeader';

const QuizContent = () => {
  const { state, loadQuestions } = useQuiz();
  const { loading, isQuizComplete, questions } = state;

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <QuizHeader />
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizLoader />
          </motion.div>
        ) : questions.length === 0 ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-morphism rounded-2xl p-8 text-center"
          >
            <p className="text-lg font-medium mb-4">Failed to load questions</p>
            <button 
              onClick={loadQuestions}
              className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all"
            >
              Retry
            </button>
          </motion.div>
        ) : isQuizComplete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizComplete />
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <QuizProgress />
            <QuizCard />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto pt-12 text-center text-sm text-muted-foreground">
        <p>© 2023 QuizGenius • AI-Powered Quiz Platform</p>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
};

export default Index;
