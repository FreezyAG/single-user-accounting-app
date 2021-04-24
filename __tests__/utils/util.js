exports.resetDB = (accountStore, transactionHistoryStore) => {
  accountStore[0].balance = 10000
  transactionHistoryStore = [];
  return { accountStore, transactionHistoryStore }
};