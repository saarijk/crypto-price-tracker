import { useEffect, useState } from "react";
import { Crypto } from "../types/Crypto";
import axios from "axios";

export default function Prices() {
  const [currentPrices, setCurrentPrices] = useState<Crypto[]>();
  const cryptoUrl = "https://cryptopriceapi.azurewebsites.net/CryptoPrices";

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get<Crypto[]>(cryptoUrl)
        .then((response) => {
          console.log(response.data);
          setCurrentPrices(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [setCurrentPrices]);

  return (
    <div className="mt-[25px] h-auto w-2/3 flex-col items-center rounded-3xl bg-black bg-opacity-20">
      <h1 className="rounded-t-3xl bg-white bg-opacity-[1%] p-5 text-3xl">
        Prices
      </h1>

      {currentPrices?.map((currentCrypto) => (
        <div key={currentCrypto.name}>
          <div className="flex h-[50px] w-full items-center justify-between px-5">
            <h3>{currentCrypto.name}</h3>
            <h3>{currentCrypto.price}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
