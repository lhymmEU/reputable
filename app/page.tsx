"use client";

import { motion } from "framer-motion";
import { Verify } from "./components/Verify";
import { useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  const handleSubmit = () => {
    setSubmittedUsername(username);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100 flex flex-col items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.svg
              key={i}
              className="absolute"
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.1,
                scale: 1,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              <path
                d="M50 10 L90 90 L10 90 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-400"
              />
            </motion.svg>
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Reputable</h1>
        <div className="flex flex-col items-start">
          <label
            htmlFor="username"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your username"
          />
          <button onClick={handleSubmit} className="mt-4 btn-primary">
            Submit
          </button>
        </div>
        <Verify actionName="login" destination="/action" btnName="Login" actionData={submittedUsername} />
      </motion.div>
    </div>
  );
}
