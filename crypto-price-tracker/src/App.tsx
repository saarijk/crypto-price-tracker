import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Prices from "./components/Prices";

function App() {
  const colours = "bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500";

  return (
    <div className={`${colours} h-full w-full px-10 py-10`}>
      <div className="h-[200px] w-[410px] flex-col items-center rounded-3xl bg-black bg-opacity-20">
        <h1 className="p-5 text-8xl">CPT</h1>
        <h2 className="mt-[-40px] p-5 text-4xl text-gray-700">
          Crypto Price Tracker
        </h2>
      </div>
      <Prices />
    </div>
  );
}

export default App;
