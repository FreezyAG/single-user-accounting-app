/* ---------------------------- in memory store ---------------------------- */
const accountId = 'afca119c-98b8-4714-8639-a4c323bf1c4b';
const testAccountId = 'afca112d-98b8-4714-8639-a4c323bf1c5d';

exports.accountId = accountId
exports.testAccountId = testAccountId
exports.accountStore = {
  [accountId]: {
    id: accountId,
    balance: 0,
    effectiveDateTime: new Date(),
  },
  [testAccountId]: {
    id: testAccountId,
    balance: 0,
    effectiveDateTime: new Date(),
  },
};
exports.transactionHistoryStore = [];
