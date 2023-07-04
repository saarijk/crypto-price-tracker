export interface Crypto {
  name: string;
  price: string;
  category: string;
  description: string;
  tokenImage: string;
}

export interface AllPrices {
  before: Crypto[];
  after: Crypto[];
}

export interface DescriptionInfo {
  description: string;
  name: string;
}
