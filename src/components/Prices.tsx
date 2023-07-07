import { useEffect, useState } from "react";
import {
  AllPrices,
  Crypto,
  DescriptionInfo,
  PriceAlert,
} from "../types/Crypto";
import axios from "axios";
import { motion } from "framer-motion";
import { BoltIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

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
          before: response.data,
          after: prevPrices.before,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Run the code immediately

    const interval = setInterval(fetchData, 5000); // Run the code again after 5000ms

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [description, setDescription] = useState<DescriptionInfo>();
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const [priceAlert, setPriceAlert] = useState<PriceAlert[]>();
  const [isPriceAlertToggled, setIsPriceAlertToggled] =
    useState<boolean>(false);
  const [nameofCurrency, setNameOfCurrency] = useState<string>("");
  const [isInvalidInput, setIsInvalidInput] = useState<boolean>();
  const [overwriteConfirmation, setOverwriteConfirmation] =
    useState<boolean>(false);

  return (
    <div className="inline-flex w-full">
      <div className="mt-[25px] h-auto w-1/2 flex-col items-center rounded-3xl bg-black bg-opacity-20">
        <motion.h1
          className="rounded-t-3xl bg-white bg-opacity-[10%] p-5 text-3xl"
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
          <div className="mt-3 flex h-[25px] w-full grid-cols-5 items-center justify-between text-lg duration-500">
            <h3>Currency</h3>
            <h3>Info</h3>
            <h3>Current price</h3>
            <h3>Difference</h3>
            <h3>Alert</h3>
          </div>
        </motion.h1>

        {currentPrices.after.map((currentCrypto, index) => {
          const beforeCrypto = currentPrices.before[index];
          let currentP: number = parseFloat(currentCrypto.price);
          let beforeP: number = parseFloat(beforeCrypto.price);
          let difference: number = currentP - beforeP;
          let isLarger = difference > 0;
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
                className="flex h-[50px] w-full items-center justify-between gap-10 px-5 hover:bg-slate-800"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="inline-flex w-[80px] text-left">
                  <img
                    className="mr-2 h-6 w-6"
                    src={beforeCrypto.tokenImage}
                  ></img>
                  {currentCrypto.name.toUpperCase()}
                </h3>
                <button
                  className="ml-2 cursor-pointer rounded-full text-left"
                  onClick={() => {
                    setDescription({
                      description: beforeCrypto.description,
                      name: beforeCrypto.name,
                    });
                    setShowDescription(!showDescription);
                  }}
                >
                  <InformationCircleIcon className="h6 w-6 text-slate-500 hover:text-white" />
                </button>
                <h3 className="w-1/5 text-right">{currentCrypto.price}</h3>
                {/*<h3>{beforeCrypto ? beforeCrypto.price : "-"}</h3> */}

                {difference === 0 ? (
                  <h3 className="w-1/5 text-right text-lg text-white">
                    {difference.toPrecision(5)}
                  </h3>
                ) : isLarger ? (
                  <h3 className="w-1/5 text-right text-green-400">
                    {beforeCrypto && beforeCrypto.price
                      ? difference.toFixed(5)
                      : "-"}
                  </h3>
                ) : (
                  <h3 className="w-1/5 text-right text-red-400">
                    {beforeCrypto && beforeCrypto.price
                      ? difference.toFixed(5)
                      : "-"}
                  </h3>
                )}
                {/* PRICE ALERT*/}
                <button
                  className="rounded-full bg-black bg-opacity-10 p-2 hover:bg-opacity-50"
                  onClick={() => {
                    setIsPriceAlertToggled(!isPriceAlertToggled);
                    setShowDescription(false);
                    setNameOfCurrency(beforeCrypto.name);
                  }}
                >
                  <BoltIcon className="h6 w-6 text-gray-500 hover:text-white" />
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      {showDescription && description && !isPriceAlertToggled && (
        <div className="ml-5 mt-5 h-[350px] w-[400px] rounded-3xl bg-black bg-opacity-20 p-5">
          About {description?.name.toUpperCase()}:<br />
          <br />
          {description?.description}
        </div>
      )}

      {/* PRICE ALERT STUFF*/}
      {isPriceAlertToggled && (
        <div className="ml-5 mt-5 h-[160px] w-[340px] rounded-3xl bg-black bg-opacity-20 p-5">
          Set price alert for {nameofCurrency.toUpperCase()}:
          <div className="w-72">
            <input
              className={`focus:shadow-outline mb-3 w-full appearance-none rounded border ${
                isInvalidInput ? "border-red-500" : "border-slate-300"
              } px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none`}
              id="pricealert"
              type="text"
              placeholder="Amount"
            />

            <button
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500"
              onClick={() => {
                const userInput = (
                  document.getElementById("pricealert") as HTMLInputElement
                )?.value;

                if (/^\d+(\.\d+)?$/.test(userInput)) {
                  const newPriceAlert: PriceAlert = {
                    name: nameofCurrency.toUpperCase(),
                    amount: userInput,
                    priceMet: false,
                  };
                  console.log(priceAlert);

                  // Check for duplicate price alert entries for the same nameofCurrency
                  const existingIndex = priceAlert?.findIndex(
                    (alert) => alert.name === newPriceAlert.name
                  );

                  if (existingIndex !== undefined && existingIndex !== -1) {
                    const shouldOverwrite = window.confirm(
                      "A price alert for this currency already exists. Do you want to overwrite it?"
                    );

                    if (shouldOverwrite) {
                      // Overwrite the existing price alert
                      setPriceAlert((prevPriceAlert = []) =>
                        prevPriceAlert.map((alert, index) =>
                          index === existingIndex ? newPriceAlert : alert
                        )
                      );
                      setIsInvalidInput(false); // Reset the invalid input state
                      setIsPriceAlertToggled(false);
                    } else {
                      console.log("Price alert not overwritten.");
                      setIsPriceAlertToggled(false);
                    }
                  } else {
                    setPriceAlert((prevPriceAlert = []) => [
                      ...prevPriceAlert,
                      newPriceAlert,
                    ]);
                    setIsInvalidInput(false); // Reset the invalid input state
                  }
                  console.log(priceAlert);
                } else {
                  console.log("Invalid input. Please enter a number.");
                  setIsInvalidInput(true); // Set the invalid input state
                }
              }}
            >
              SAVE
            </button>

            {overwriteConfirmation && (
              <p className="mt-2 text-red-500">
                Overwriting the existing price alert...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
