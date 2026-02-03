"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Backdrop overlay component
 * - Dims background content
 * - Closes drawer on click
 * - Prevents body scroll when active
 */
export function Overlay({ isOpen, onClose }: OverlayProps) {
  // Prevent body scroll when overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
