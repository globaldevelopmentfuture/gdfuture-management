"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
          className="relative w-[90vw] max-w-[1200px] h-[85vh] bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
        >
          {/* Glassmorphism effects */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-yellow-500/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-purple-500/10 to-transparent" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-2xl" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between p-6 border-b border-white/10">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-semibold text-white"
            >
              {title}
            </motion.h3>
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="relative p-2 rounded-xl text-white/60 hover:text-white group"
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors" />
              <X className="w-5 h-5 relative z-10" />
            </motion.button>
          </div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            // Adăugăm overflow-y-auto pentru scroll dacă e necesar
            className="relative p-6 h-[calc(85vh-88px)] overflow-y-auto"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
