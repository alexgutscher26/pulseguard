"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useHaptic } from "@/hooks/use-haptic";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

/**
 * Reusable drawer component with:
 * - Slide-in animation from left/right
 * - Integrated backdrop overlay with dynamic opacity/blur synced to drag displacement
 * - Focus trap when open
 * - ESC key to close
 * - Touch-friendly drag-to-close with haptic threshold confirmation
 * - Accessible keyboard navigation
 */
export function Drawer({ isOpen, onClose, children, side = "left" }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { trigger } = useHaptic();
  const hasTriggeredHaptic = useRef(false);

  // Motion value for tracking the drag x-position
  const x = useMotionValue(side === "left" ? -256 : 256);

  // Map x-displacement to backdrop opacity (0 when fully closed, 1 when fully open)
  const opacity = useTransform(x, side === "left" ? [-256, 0] : [256, 0], [0, 1]);

  // Map x-displacement to dynamic backdrop blur (0px closed, 4px open)
  const blurVal = useTransform(x, side === "left" ? [-256, 0] : [256, 0], [0, 4]);
  const backdropFilter = useTransform(blurVal, (v) => `blur(${v}px)`);

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

  // Focus trap & Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

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

      return () => {
        document.removeEventListener("keydown", handleTab);
        document.body.style.overflow = "";
      };
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const slideVariants = {
    hidden: { x: side === "left" ? -256 : 256 },
    visible: { x: 0 },
    exit: { x: side === "left" ? -256 : 256 },
  };

  const swipeThreshold = 50;

  const handleDrag = () => {
    const currentX = x.get();
    const isPastThreshold =
      side === "left" ? currentX < -swipeThreshold : currentX > swipeThreshold;

    if (isPastThreshold && !hasTriggeredHaptic.current) {
      trigger("light"); // Crisp subtle tick when passing threshold
      hasTriggeredHaptic.current = true;
    } else if (!isPastThreshold && hasTriggeredHaptic.current) {
      hasTriggeredHaptic.current = false; // Reset if they pull it back
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay synced to swipe/drag offset */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ opacity, backdropFilter }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
            aria-hidden="true"
          />

          {/* Drawer Element */}
          <motion.div
            ref={drawerRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            style={{ x }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"} h-full w-64 bg-[#050505] border-${side === "left" ? "r" : "l"} border-primary/20 z-50 shadow-2xl touch-pan-y`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
            drag="x"
            dragConstraints={side === "left" ? { left: -256, right: 0 } : { left: 0, right: 256 }}
            dragElastic={0.1}
            onDragStart={() => {
              hasTriggeredHaptic.current = false;
            }}
            onDrag={handleDrag}
            onDragEnd={(e, { velocity }) => {
              const currentX = x.get();
              const isPastThreshold =
                side === "left" ? currentX < -swipeThreshold : currentX > swipeThreshold;
              const velocityThreshold = 200;
              const isFastSwipe =
                side === "left" ? velocity.x < -velocityThreshold : velocity.x > velocityThreshold;

              if (isPastThreshold || isFastSwipe) {
                trigger("medium"); // Medium vibration to confirm close trigger
                onClose();
              } else {
                hasTriggeredHaptic.current = false;
              }
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
