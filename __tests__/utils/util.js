/* eslint-disable no-param-reassign */
exports.resetDB = ({ accountStore, accountId, transactionHistoryStore }) => {
  accountStore[accountId].balance = 10000;
  transactionHistoryStore = [];
  return { accountStore, transactionHistoryStore };
};