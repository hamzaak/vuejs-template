import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { uuid4 } from "@/utils/object-utils";
import { users, currencies, directories, accounts, transactions } from "@/mock/data";
let _users = users;
let _currencies = currencies;
let _directories = directories;
let _accounts = accounts;
let _transactions = transactions;

const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4";

export default {
  bootstrap() {
    let mock = new MockAdapter(axios);

    mock.onPost("/auth/login").reply(config => {
      let { username, password } = JSON.parse(config.data);
      console.log(JSON.parse(config.data))
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = users.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: "", user: user, token: TOKEN }]);
          } else {
            resolve([
              200,
              {
                code: 500,
                msg: "username or password is wrong!"
              }
            ]);
          }
        }, 100);
      });
    });

    mock.onGet("/auth/check").reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const authHeader = config.headers.Authorization;
          if (authHeader === `Bearer ${TOKEN}`) {
            resolve([200, { code: 200, msg: "ok", token: config.data }]);
          } else {
            resolve([200, { code: 401, msg: "not ok" }]);
          }
        }, 100);
      });
    });

    mock.onGet("/currencies/getall").reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, [..._currencies]]);
        }, 100);
      });
    });

    mock.onGet("/currencies/get").reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const item = _currencies.filter(x => x.id == id)[0];
          resolve([200, Object.assign({}, item)]);
        }, 100);
      });
    });

    mock.onPost("/currencies/add").reply(config => {
      const currency = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          currency.id = Math.max.apply(Math, _currencies.map(function(x) { return x.id; })) + 1;
          _currencies.push(currency);
          resolve([200,  Object.assign({}, currency)]);
        }, 100);
      });
    });

    mock.onPost("/currencies/update").reply(config => {
      const currency = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const items = _currencies.filter(x => x.id !== currency.id);
          items.push(currency);
          _currencies = items;
          resolve([200, Object.assign({}, currency)]);
        }, 100);
      });
    });

    mock.onPost("/currencies/delete").reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          _currencies = _currencies.filter(x => x.id !== id);
          resolve([200,  {} ]);
        }, 100);
      });
    });

    mock.onGet("/directories/getall").reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, [..._directories]]);
        }, 100);
      });
    });

    mock.onGet("/directories/get").reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const item = _directories.filter(x => x.id == id)[0];
          resolve([200,  Object.assign({}, item)]);
        }, 100);
      });
    });

    mock.onPost("/directories/add").reply(config => {
      const directory = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          directory.id = Math.max.apply(Math, _directories.map(function(x) { return x.id; })) + 1;
          _directories.push(directory);
          resolve([200,   Object.assign({}, directory)]);
        }, 100);
      });
    });

    mock.onPost("/directories/update").reply(config => {
      const directory = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const items = _directories.filter(x => x.id !== directory.id);
          items.push(directory);
          _directories = items;
          resolve([200,  Object.assign({}, directory) ]);
        }, 100);
      });
    });

    mock.onPost("/directories/delete").reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          _directories = _directories.filter(x => x.id !== id);
          resolve([200,  {} ]);
        }, 100);
      });
    });

    mock.onGet("/accounts/getall").reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          _accounts.forEach(function(account) {
            account.currency = _currencies.filter(
              currency => currency.id == account.currencyId
            )[0];
            account.directory = _directories.filter(
              directory => directory.id == account.directoryId
            )[0];
          });
          resolve([200,  [..._accounts]]);
        }, 100);
      });
    });

    mock.onGet(`/accounts/get`).reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const account = _accounts.filter(x => x.id == id)[0];
          account.currency = _currencies.filter(
            currency => currency.id == account.currencyId
          )[0];
          account.directory = _directories.filter(
            directory => directory.id == account.directoryId
          )[0];
          resolve([200,  Object.assign({}, account)]);
        }, 100);
      });
    });

    mock.onPost("/accounts/add").reply(config => {
      const account = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          account.id = Math.max.apply(Math, _accounts.map(function(x) { return x.id; })) + 1;
          account.directory = _directories.filter(
            directory => directory.id == account.directoryId
          )[0];
          account.currency = _currencies.filter(
            currency => currency.id == account.currencyId
          )[0];
          _accounts.push(account);
          resolve([200,  Object.assign({}, account)]);
        }, 100);
      });
    });

    mock.onPost("/accounts/update").reply(config => {
      const account = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const items = _accounts.filter(x => x.id !== account.id);
          account.directory = _directories.filter(
            directory => directory.id == account.directoryId
          )[0];
          account.currency = _currencies.filter(
            currency => currency.id == account.currencyId
          )[0];
          items.push(account);
          _accounts = items;
          resolve([200,  Object.assign({}, account)]);
        }, 100);
      });
    });

    mock.onPost("/accounts/delete").reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          _accounts = _accounts.filter(x => x.id !== id);
          _transactions = _transactions.filter(x => x.accountId !== id);
          resolve([200, {}]);
        }, 100);
      });
    });

    mock.onGet("/transactions/getall").reply(config => {
      const query = config.params.query;
      const { accountId, date, amount, type, description, pageSize, currentPage } = JSON.parse(query);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredItems = _transactions
            .filter(
              x => x.accountId == accountId && 
                (new Date(x.date)) >= (new Date(date[0])) &&
                (new Date(x.date)) <= (new Date(date[1])) &&
                x.amount >= amount[0] &&
                x.amount <= amount[1] &&
                (x.type == type || type == 0) &&
                x.description.includes(description))
            .sort(function(a, b) {
              var dateA = new Date(a.date), dateB = new Date(b.date);
              return dateB - dateA;
            });
          const pagedItems = filteredItems.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          );
          const total = filteredItems.length;
          resolve([200, { transactions: pagedItems, total: total }]);
        }, 100);
      });
    });
    
    mock.onGet("/transactions/get").reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const item = _transactions.filter(x => x.id == id)[0];
          resolve([200,  Object.assign({}, item)]);
        }, 100);
      });
    });

    mock.onPost("/transactions/add").reply(config => {
      const transaction = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          transaction.id = uuid4();
          _transactions.push(transaction);
          resolve([200,  Object.assign({}, transaction)]);
        }, 100);
      });
    });

    mock.onPost("/transactions/update").reply(config => {
      const transaction = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const items = _transactions.filter(x => x.id !== transaction.id);
          items.push(transaction);
          _transactions = items;
          resolve([200,  Object.assign({}, transaction)]);
        }, 100);
      });
    });

    mock.onPost("/transactions/transfer").reply(config => {
      const dto = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const fromAccount = _accounts.filter(x => x.id === dto.fromAccountId)[0];
          const toAccount = _accounts.filter(x => x.id === dto.toAccountId)[0];
          
          const fromTransaction = {
            id: uuid4(),
            accountId: dto.fromAccountId,
            date: dto.date,
            amount: dto.amount + dto.commission,
            type: 2,
            description: dto.description
          };

          const toAmount = dto.amount * fromAccount.currency.value / toAccount.currency.value;
          const toTransaction = {
            id: uuid4(),
            accountId: dto.toAccountId,
            date: dto.date,
            amount: toAmount,
            type: 1,
            description: dto.description
          };

          _transactions.push(fromTransaction);
          _transactions.push(toTransaction);
          resolve([200, {}]);
        }, 100);
      });
    });

    mock.onPost("/transactions/delete").reply(config => {
      const id = config.params.id;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          _transactions = _transactions.filter(x => x.id !== id);
          resolve([200, {}]);
        }, 100);
      });
    });

    mock.onGet("/transactions/getsumsbyaccount").reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = [];
          _transactions.reduce(function (res, item) {
              if (!res[item.accountId]) {
                  res[item.accountId] = {
                      sum: 0,
                      originalSum: 0,
                      accountId: item.accountId,
                      account: _accounts.filter(x => x.id == item.accountId)[0]
                  };
                  result.push(res[item.accountId]);
              }
              let value = item.amount * res[item.accountId].account.currency.value;
              value = Math.round(value * 100) / 100
              res[item.accountId].sum = item.type == 1
                ? res[item.accountId].sum + value 
                : res[item.accountId].sum - value; 
              
              let originalSum = item.amount;
              res[item.accountId].originalSum = item.type == 1
                ? res[item.accountId].originalSum + originalSum 
                : res[item.accountId].originalSum - originalSum; 
              return res;
          }, {});

          resolve([200, result]);
        }, 100);
      });
    });

    mock.onGet("/transactions/getsumsbydate").reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = [];
          const filteredItems = _transactions.sort(function(a, b) {
            var dateA = new Date(a.date), dateB = new Date(b.date);
            return dateA - dateB;
          });
          let total = 0;
          filteredItems.reduce(function (res, item) {
            if (!res[item.date]) {
                res[item.date] = {
                    sum: 0,
                    total: 0,
                    date: item.date
                };
                result.push(res[item.date]);
            }
            const account = _accounts.filter(x => x.id == item.accountId)[0];
            let value = item.amount * account.currency.value;
            total = account.type == 1
              ? item.type == 1 ? total + value : total - value
              : item.type == 1 ? total - value : total + value;

            res[item.date].total = total;

            value = Math.round(value * 100) / 100
            res[item.date].sum = account.type == 1
              ? item.type == 1 ? res[item.date].sum + value : res[item.date].sum - value
              : item.type == 1 ? res[item.date].sum - value : res[item.date].sum + value;
            
            return res;
          }, {});

          resolve([200, result]);
        }, 100);
      });
    });
  }
};
