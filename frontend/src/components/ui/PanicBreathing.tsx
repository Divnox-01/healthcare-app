'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PanicBreathing = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runCycle = () => {
      setPhase('Inhale');
      timeoutId = setTimeout(() => {
        setPhase('Hold');
        timeoutId = setTimeout(() => {
          setPhase('Exhale');
          timeoutId = setTimeout(runCycle, 6000); // Exhale 6s
        }, 4000); // Hold 4s
      }, 4000); // Inhale 4s
    };

    runCycle();

    return () => clearTimeout(timeoutId);
  }, []);

  const variants: import('framer-motion').Variants = {
    Inhale: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "easeInOut" } },
    Hold: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "linear" } },
    Exhale: { scale: 1, opacity: 0.4, transition: { duration: 6, ease: "easeInOut" } }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
      <h3 className="text-xl font-medium text-gray-700 mb-8 z-10 text-center">
        You're safe. Breathe with me.
      </h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Breathing Circle */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-blue-300 blur-md"
          animate={phase}
          variants={variants}
        />
        <motion.div 
          className="absolute w-24 h-24 rounded-full bg-blue-400 blur-sm shadow-xl shadow-blue-200"
          animate={phase}
          variants={variants}
        />
        
        {/* Phase Text */}
        <div className="z-10 font-bold text-2xl text-blue-900 tracking-wider h-8 overflow-hidden relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute"
            >
              {phase}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      
      <p className="mt-12 text-sm text-gray-500 z-10">Follow the circle's rhythm</p>
    </div>
  );
};

export default PanicBreathing;
