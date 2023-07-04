import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Prices from "./components/Prices";
import { motion } from "framer-motion";

function App() {
  const colours =
    "bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black";

  return (
    <div className={`${colours} h-full w-full px-10 py-10`}>
      <motion.div
        className="h-[200px] w-[410px] flex-col items-center rounded-3xl bg-black bg-opacity-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <h1 className="p-5 text-8xl">CPT</h1>
        <h2 className="mt-[-40px] p-5 text-4xl text-gray-700">
          Crypto Price Tracker
        </h2>
      </motion.div>
      <div className="inline-flex w-full">
        <Prices />
      </div>
    </div>
  );
}

export default App;
