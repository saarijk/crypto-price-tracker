import { useEffect, useState } from "react";
import { Price } from "../types/Price";

export default function Prices() {
  const priceGETUrls = [
    { "https://candle.etoro.com/candles/asc.json/OneDay/2/100003": "xrp" },
    { "https://candle.etoro.com/candles/asc.json/OneDay/2/100040": "link" },
  ];

  const [currentPrices, setCurrentPrices] = useState<Price[]>();

  useEffect(() => {
    const interval = setInterval(() => {}, 5000);
    priceGETUrls.forEach((element) => {
      const [url, name] = Object.entries(element)[0];
      (async () => {
        const response = await fetch(url);
        const body = await response.text();
        console.log(body);
      })();
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-[25px] h-auto w-2/3 flex-col items-center rounded-3xl bg-black bg-opacity-20">
      <h1 className="p-5 text-3xl">Prices</h1>
      <div className="flex h-[50px] w-full items-center justify-between rounded-b-3xl bg-white bg-opacity-[2%] px-5">
        <h3>XRP</h3>
        <h3>PRICE</h3>
      </div>
    </div>
  );
}
