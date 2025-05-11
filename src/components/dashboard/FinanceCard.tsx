
import React from "react";
import { motion } from "framer-motion";

interface FinanceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "standard" | "premium";
}

export function FinanceCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  variant = "standard" 
}: FinanceCardProps) {
  return (
    <motion.article 
      className={`
        relative w-[210px] p-6 rounded-xl cursor-pointer transition-all duration-300
        ${variant === "standard" 
          ? "bg-[#151530]/80 border border-[#333945] hover:bg-[#1c1c3c]/90" 
          : "bg-[#151525]/80 backdrop-blur-sm border border-[#2751B9]/30 hover:bg-[#191944]/80"}
        ${variant === "premium" && "shadow-[0_0_25px_rgba(39,81,185,0.25)]"}
        card-hover
      `}
      onClick={onClick}
      whileHover={{ 
        scale: 1.03,
        boxShadow: variant === "premium" ? "0 0 30px rgba(39,81,185,0.4)" : "0 0 15px rgba(51,57,69,0.3)" 
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {variant === "premium" && (
        <>
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#2751B9]/40 via-[#3962c8]/70 to-[#2751B9]/40 blur-[1.5px] -z-10" />
          <div className="absolute -inset-[20px] bg-[#2751B9]/10 rounded-full blur-[20px] -z-20" />
        </>
      )}
      <div className={`mb-4 ${variant === "premium" ? "text-[#3962c8]" : "text-[#2751B9]"}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl text-white font-semibold mb-2">{title}</h2>
        <p className="text-sm text-[#8E9196] leading-relaxed">{description}</p>
      </div>
      {variant === "premium" && (
        <>
          <div className="absolute top-3 right-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#3962c8"/>
              <path d="M12 5V3M12 21V19M5 12H3M21 12H19M18.364 18.364L16.95 16.95M18.364 5.636L16.95 7.05M5.636 18.364L7.05 16.95M5.636 5.636L7.05 7.05" stroke="#3962c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-[#2751B9]/40 to-transparent rounded-bl-xl rounded-tr-xl opacity-80" />
        </>
      )}
    </motion.article>
  );
}
