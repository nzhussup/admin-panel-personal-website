import React from "react";
import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
