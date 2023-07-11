export interface Crypto {
  name: string;
  price: string;
  category: string;
  description: string;
  tokenImage: string;
  hasAlert: boolean;
}

export interface AllPrices {
  newPrice: Crypto[];
  beforePrice: Crypto[];
}

export interface DescriptionInfo {
  description: string;
  name: string;
}

export interface PriceAlert {
  alertName: string;
  alertAmount: number;
}
