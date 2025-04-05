"use client";
import React from 'react';
import DecryptedText from '@/components/ui/DecryptedText';
import { useRouter } from 'next/navigation';
import { Teko } from 'next/font/google';
import { motion } from 'framer-motion';
import { useState,useEffect } from 'react';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const teko = Teko({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const page = () => {
  const router = useRouter();
  const [showArrow, setShowArrow] = useState(false);

  const handleRedirect = () => {
    router.push('/workouts');
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(true), 1500); // adjust based on speed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 text-white flex items-center justify-start px-10 pt-20">
    
        <h1 className={`text-[5rem] leading-snug font-extrabold ${teko.className}`}>
        <div className="mb-4">
        <DecryptedText
          text="Stop guessing."
          speed={100}
          animateOn="view"
          revealDirection="start"
          sequential={true}
        />
      </div>
      
      <div className="mb-4">
        <DecryptedText
          text="Start growing."
          speed={100}
          animateOn="view"
          revealDirection="start"
          sequential={true}
        />
      </div>

      <div className="mb-4">
      
        <DecryptedText
          text="Start tracking."
          speed={100}
          animateOn="view"
            revealDirection="start"
            sequential={true}
          />
          
      </div>
      </h1>
      {showArrow && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-10 right-10 cursor-pointer"
          onClick={handleRedirect}
        >
          <div className="animate-bounce text-5xl"><FontAwesomeIcon icon={faCircleRight} className='fa-fw'/></div>
        </motion.div>
      )}

      </div>
      
  );
};

export default page;
