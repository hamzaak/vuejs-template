/* eslint-disable */
export const users = [
  { id: 1, username: "Admin", password: "Admin123", fullname: "Administrator", roleId: 1 }
];

export const currencies = [
  { id: 1, name: "USD", value: 1 }, // Reference currency
  { id: 2, name: "GOLD", value: 1460 } // Ons value
];

export const directories = [
  { id: 1, name: "Deposits" },
  { id: 2, name: "Investments" },
  { id: 3, name: "Credit Cards" }
];

// type: income/expense
export const accounts = [
  { id: 1, name: "Bank of America", currencyId: 1, directoryId: 1, description: "Saving deposit account", type: 1 },
  { id: 2, name: "Citigroup", currencyId: 1, directoryId: 1, description: "Saving deposit account", type: 1 },
  { id: 3, name: "Bank of America", currencyId: 2, directoryId: 2, description: "Gold investment account", type: 1 },
  { id: 4, name: "Citigroup", currencyId: 1, directoryId: 3, description: "Main credit card", type: 2 },
  { id: 5, name: "Citigroup (My Son)", currencyId: 1, directoryId: 3, description: "My son credit card", type: 2 },
];

export const transactions = [
  { id: "356c1410-391f-47a1-8bb9-95bc83263445", date: "2019-01-01", accountId: 1, amount: 3000, type: 1, description: "salary payment" },
  { id: "9699143c-2f0a-48e0-aa49-3975972ad339", date: "2019-01-14", accountId: 1, amount: 500, type: 2, description: "credit card payment" },
  { id: "1923a1be-3bfc-470c-8c31-bd37a73fb9a6", date: "2019-01-14", accountId: 4, amount: 500, type: 1, description: "credit card payment" },
  { id: "4e797ad4-00e2-4dc6-889b-ab74d6c122ce", date: "2019-01-15", accountId: 1, amount: 350, type: 2, description: "kitchen renovation" },
  { id: "21c94ac4-15bd-4847-9c52-3308ab3149b9", date: "2019-02-01", accountId: 1, amount: 3000, type: 1, description: "salary payment" },
  { id: "e24a35b9-d1db-454a-9cb1-b0fad3de340b", date: "2019-02-01", accountId: 1, amount: 2920, type: 2, description: "2 ons gold purchased" },
  { id: "fb8d2d71-97d1-4881-987a-3039b7a72886", date: "2019-02-01", accountId: 3, amount: 2, type: 1, description: "2 ons gold purchased" },
  { id: "378b4de9-0324-46e1-810b-4213339d42b2", date: "2019-02-10", accountId: 1, amount: 6000, type: 1, description: "bonus payment" },
  { id: "c9dc53c8-7cfe-46b2-8f66-3df064e7c15d", date: "2019-02-14", accountId: 1, amount: 650, type: 2, description: "credit card payment" },
  { id: "5e34795a-7426-420c-a915-d9be6ec3e653", date: "2019-02-14", accountId: 5, amount: 650, type: 1, description: "credit card payment" },
  { id: "c844ffea-ec62-4ecc-947e-941697baa974", date: "2019-02-17", accountId: 1, amount: 200, type: 2, description: "son credit card payment" },
  { id: "e26863ec-a10b-45a1-8408-f8f95d22d982", date: "2019-02-17", accountId: 5, amount: 200, type: 1, description: "son credit card payment" },
  { id: "f47752b7-e47c-4ae3-9dd2-1f71ce1ea58d", date: "2019-03-01", accountId: 1, amount: 3000, type: 1, description: "salary payment" },
  { id: "3066e2da-43b5-4b62-b105-fc8ab12c7cf5", date: "2019-03-06", accountId: 2, amount: 10000, type: 1, description: "freelance website payment" },
  { id: "844f320c-36d5-407d-acef-28aea6846134", date: "2019-03-10", accountId: 2, amount: 2920, type: 2, description: "2 ons gold purchased" },
  { id: "73d9e510-d4ae-412d-8556-7656c7e1a7f5", date: "2019-03-10", accountId: 3, amount: 2, type: 1, description: "2 ons gold purchased" }
];
