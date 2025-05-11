
import React from "react";
import { motion } from "framer-motion";

export function FinanceHeader() {
  return (
    <header className="text-center w-full max-w-[600px] px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base text-[#8E9196] leading-6"
      >
        <h1 className="text-4xl sm:text-5xl text-white font-bold mb-4">All your finances..</h1>
        <p className="text-lg">
          Earn 2.25% interest on unlimited cash with your current account.<br/>
          Get your subscription free card to spend and earn 1% Saveback.
        </p>
      </motion.div>
    </header>
  );
}
