export interface Crypto {
  name: string;
  price: string;
}

export interface AllPrices {
  before: Crypto[];
  after: Crypto[];
}
