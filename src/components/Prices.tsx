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
    newPrice: [],
    beforePrice: [],
  });
  const cryptoUrl = "https://cryptopriceapi.azurewebsites.net/CryptoPrices";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let currentDate = new Date().toLocaleString();

  const [description, setDescription] = useState<DescriptionInfo>();
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const [isPriceAlertToggled, setIsPriceAlertToggled] =
    useState<boolean>(false);
  const [nameofCurrency, setNameOfCurrency] = useState<string>("");
  const [isInvalidInput, setIsInvalidInput] = useState<boolean>();
  const [overwriteConfirmation, setOverwriteConfirmation] =
    useState<boolean>(false);

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [alertName, setAlertName] = useState<string>("");
  const [alertPrice, setAlertPrice] = useState<string>("");
  const [isAlert, setIsAlert] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Crypto[]>(cryptoUrl);
        console.log(response.data);
        setCurrentPrices((prevPrices) => ({
          newPrice: response.data,
          beforePrice: prevPrices.newPrice,
        }));
        alerts.forEach((alert) => {});
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

  function addNewPriceAlert(name: string, amount: number) {
    // check for legitimate data
    // check for duplicates
    const existingAlert = alerts.find((alert) => alert.alertName === name);
    if (existingAlert) {
      // a duplicate exists
      console.log("Alert found! Overwriting existing entry.");
      existingAlert.alertAmount = amount;
    } else {
      // add to array
      alerts.push({ alertName: name, alertAmount: amount });
    }
    console.log(alerts);
  }

  function calculateDifference(after: number, before: number): number {
    let diff = after - before;
    return diff;
  }

  function checkPriceAlerts(crypto: Crypto): Crypto {
    // compare name of the currency against the array, see if the same name exists
    for (let i = 0; i < alerts.length; i++) {
      if (crypto.name.toUpperCase() === alerts[i].alertName.toUpperCase()) {
        crypto.hasAlert = true;
        return crypto;
      }
    }
    return crypto;
  }

  function findAlertPrice(name: string, array: PriceAlert[]): number {
    let amount = 0;
    for (let i = 0; i < array.length; i++) {
      if (name.toUpperCase() === array[i].alertName.toUpperCase()) {
        amount = array[i].alertAmount;
        return amount;
      }
    }
    return amount;
  }

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
          Prices ({currentDate}, {timezone})
          <div className="mt-3 flex h-[25px] w-full grid-cols-5 items-center justify-between text-lg duration-500">
            <h3>Currency</h3>
            <h3>Info</h3>
            <h3>Current price</h3>
            <h3>Difference</h3>
            <h3>Alert</h3>
          </div>
        </motion.h1>

        {currentPrices.beforePrice.map((currentCrypto, index) => {
          let cryptoInfo = currentPrices.newPrice[index];
          const difference = calculateDifference(
            parseFloat(cryptoInfo.price),
            parseFloat(currentCrypto.price)
          );
          let isLarger = difference > 0;
          const ping = "animate-ping";
          cryptoInfo = checkPriceAlerts(cryptoInfo);
          let alertAmount = findAlertPrice(cryptoInfo.name, alerts);
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
                    src={cryptoInfo.tokenImage}
                  ></img>
                  {currentCrypto.name.toUpperCase()}
                </h3>
                <button
                  className="ml-2 cursor-pointer rounded-full text-left"
                  onClick={() => {
                    setDescription({
                      description: cryptoInfo.description,
                      name: cryptoInfo.name,
                    });
                    setShowDescription(!showDescription);
                  }}
                >
                  <InformationCircleIcon className="h6 w-6 text-slate-500 hover:text-white" />
                </button>
                <h3 className="w-1/5 text-right">{cryptoInfo.price}</h3>
                {/*<h3>{beforeCrypto ? beforeCrypto.price : "-"}</h3> */}

                {difference === 0 ? (
                  <h3 className="text-md w-1/5 text-right text-white">
                    {difference.toFixed(5)}
                  </h3>
                ) : isLarger ? (
                  <h3 className="text-md w-1/5 text-right text-green-400">
                    {cryptoInfo && cryptoInfo.price
                      ? difference.toFixed(5)
                      : "-"}
                  </h3>
                ) : (
                  <h3 className="text-md w-1/5 text-right text-red-400">
                    {cryptoInfo && cryptoInfo.price
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
                    setNameOfCurrency(cryptoInfo.name);
                  }}
                >
                  {cryptoInfo.hasAlert ? (
                    <BoltIcon
                      className={`h6 w-6 text-yellow-500 hover:text-yellow-400 ${
                        alertAmount <= parseFloat(cryptoInfo.price)
                          ? `${ping}`
                          : ""
                      }`}
                    />
                  ) : (
                    <BoltIcon className="h6 w-6 text-gray-500 hover:text-white" />
                  )}
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

                addNewPriceAlert(
                  nameofCurrency.toUpperCase(),
                  parseFloat(userInput)
                );
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
