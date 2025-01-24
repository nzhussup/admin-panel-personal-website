import React, { memo } from "react";
import { motion } from "framer-motion";

const PageWrapper = memo(({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      transform: "translateY(20px)",
      willChange: "transform, opacity",
    },
    animate: {
      opacity: 1,
      transform: "translateY(0)",
      willChange: "transform, opacity",
    },
    exit: {
      opacity: 0,
      transform: "translateY(-20px)",
      willChange: "transform, opacity",
    },
  };

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={pageVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
});

export default PageWrapper;
