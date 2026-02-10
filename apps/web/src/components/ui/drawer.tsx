"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

/**
 * Reusable drawer component with:
 * - Slide-in animation from left/right
 * - Focus trap when open
 * - ESC key to close
 * - Accessible keyboard navigation
 */
export function Drawer({ isOpen, onClose, children, side = "left" }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTab);
      firstElement?.focus();

      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [isOpen]);

  const slideVariants = {
    hidden: { x: side === "left" ? "-100%" : "100%" },
    visible: { x: 0 },
    exit: { x: side === "left" ? "-100%" : "100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"} h-full w-64 bg-[#050505] border-${side === "left" ? "r" : "l"} border-primary/20 z-50 shadow-2xl touch-pan-y`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          drag="x"
          dragConstraints={side === "left" ? { left: 0, right: 0 } : { left: 0, right: 0 }}
          dragElastic={{
            left: side === "left" ? 0.5 : 0.05,
            right: side === "right" ? 0.5 : 0.05,
          }}
          onDragEnd={(e, { offset, velocity }) => {
            const swipeThreshold = 50;
            const velocityThreshold = 200;

            // Close if swiped left (for left sidebar)
            if (side === "left") {
              if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
                onClose();
              }
            }
            // Close if swiped right (for right sidebar)
            else {
              if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
                onClose();
              }
            }
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
