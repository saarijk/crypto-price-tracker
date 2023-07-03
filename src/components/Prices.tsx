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
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let s = new Date().toLocaleString();

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
        Prices ({s}, {timezone})
        <div className="mt-3 flex h-[50px] w-full items-center justify-between text-lg">
          <h3>Currency</h3>
          <h3 className="text-center">
            Current <br />
            price
          </h3>
          <h3>Difference</h3>
        </div>
      </motion.h1>

      {currentPrices.after.map((currentCrypto, index) => {
        const beforeCrypto = currentPrices.before[index];
        let currentP: number = parseFloat(currentCrypto.price);
        let beforeP: number = parseFloat(beforeCrypto.price);
        let difference: number = currentP - beforeP;
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
              <h3 className="w-[80px] text-left">
                {currentCrypto.name.toUpperCase()}
              </h3>
              <h3 className="w-[80px] text-left">{currentCrypto.price}</h3>
              {/*<h3>{beforeCrypto ? beforeCrypto.price : "-"}</h3> */}

              {difference === 0 ? (
                <h3 className="w-[80px] text-right">-</h3>
              ) : (
                <h3>{beforeCrypto ? difference.toFixed(5) : "-"}</h3>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
