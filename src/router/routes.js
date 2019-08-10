import Login from "@/views/Login";
import Layout from "@/layout/Layout";
import TransactionList from "@/views/transaction/TransactionList";
import TransactionCreate from "@/views/transaction/TransactionCreate";
import TransactionUpdate from "@/views/transaction/TransactionUpdate";
import TransactionTransfer from "@/views/transaction/TransactionTransfer";
import Summary from "@/views/Summary";
import Settings from "@/views/Settings";
import AccountList from "@/views/account/AccountList";
import AccountCreate from "@/views/account/AccountCreate";
import AccountUpdate from "@/views/account/AccountUpdate";
import DirectoryCreate from "@/views/directory/DirectoryCreate";
import DirectoryUpdate from "@/views/directory/DirectoryUpdate";
import CurrenctList from "@/views/currency/CurrencyList";
import CurrencyCreate from "@/views/currency/CurrencyCreate";
import CurrencyUpdate from "@/views/currency/CurrencyUpdate";

const routes = [
  { path: "/", name: "login", component: Login },
  {
    path: "/layout", name: "layout", component: Layout, children: [
      { path: "/summary", name: "summary", component: Summary },
      { path: "/transactions/:accountId", name: "transactions", component: TransactionList },
      { path: "/transactions/create/:accountId", name: "transactions-create", component: TransactionCreate },
      { path: "/transactions/update/:id", name: "transactions-update", component: TransactionUpdate },
      { path: "/transactions/transfer/:accountId", name: "transactions-transfer", component: TransactionTransfer },
      {
        path: "/settings", name: "settings", component: Settings, children: [
          { path: "/settings/accounts", name: "settings-accounts", component: AccountList },
          { path: "/settings/currencies", name: "settings-currencies", component: CurrenctList }
        ]
      },
      { path: "/settings/accounts/create", name: "settings-accounts-create", component: AccountCreate },
      { path: "/settings/accounts/update/:id", name: "settings-accounts-update", component: AccountUpdate },
      { path: "/settings/directories/create", name: "settings-directories-create", component: DirectoryCreate },
      { path: "/settings/directories/update/:id", name: "settings-directories-update", component: DirectoryUpdate },
      { path: "/settings/currencies/create", name: "settings-currencies-create", component: CurrencyCreate },
      { path: "/settings/currencies/update/:id", name: "settings-currencies-update", component: CurrencyUpdate }
    ]
  }
];

export default routes;
