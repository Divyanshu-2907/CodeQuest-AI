"use client";

import { useState } from "react";
import { BootSequence } from "@/components/os/BootSequence";
import { DesktopHUD } from "@/components/os/DesktopHUD";
import { NeuralToolbar } from "@/components/os/NeuralToolbar";
import { AnimatePresence, motion } from "framer-motion";

export default function NeuralOS() {
  const [bootCompleted, setBootCompleted] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!bootCompleted && (
          <BootSequence onComplete={() => setBootCompleted(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bootCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <DesktopHUD />
            <NeuralToolbar />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
