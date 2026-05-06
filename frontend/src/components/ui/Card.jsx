import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = ({ className, children, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, borderColor: 'rgba(14, 165, 233, 0.3)' } : {}}
      className={cn(
        'glass-card p-6 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
