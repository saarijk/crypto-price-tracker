import { useEffect, useState } from "react";
import { AllPrices, Crypto } from "../types/Crypto";
import axios from "axios";
import { motion } from "framer-motion";

export default function Prices() {
  const [currentPrices, setCurrentPrices] = useState<AllPrices>({
    before: [],
    after: [],
  });
  const cryptoUrl = "https://cryptopriceapi.azurewebsites.net/CryptoPrices";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Crypto[]>(cryptoUrl);
        console.log(response.data);
        setCurrentPrices((prevPrices) => ({
          before: prevPrices.after,
          after: response.data,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Run the code immediately

    const interval = setInterval(fetchData, 5000); // Run the code again after 5000ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-[25px] h-auto w-2/3 flex-col items-center rounded-3xl bg-black bg-opacity-20">
      <motion.h1
        className="rounded-t-3xl bg-white bg-opacity-[1%] p-5 text-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0, duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        Prices
      </motion.h1>

      {currentPrices.after.map((currentCrypto, index) => {
        const beforeCrypto = currentPrices.before[index];
        return (
          <motion.div
            key={currentCrypto.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0, duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <motion.div
              className="flex h-[50px] w-full items-center justify-between px-5"
              whileHover={{ scale: 1.01 }}
            >
              <h3>{currentCrypto.name.toUpperCase()}</h3>
              <h3>{currentCrypto.price}</h3>
              <h3>{beforeCrypto ? beforeCrypto.price : "-"}</h3>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
