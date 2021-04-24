/* -------------------------------------------------------------------------- */
/*                              external imports                              */
/* -------------------------------------------------------------------------- */
const AsyncLock = require('async-lock');

const lock = new AsyncLock();

/* ---------------------------- internal imports ---------------------------- */
const { accountStore, transactionHistoryStore } = require('../db/database');
const logger = require('../lib/logger');
const { throwError } = require('../utils/error');

exports.accountId = accountStore[0].id; // this is a constant because we emulate a single user

/**
 * Persists the transaction history
 * @param transactionHistory object
 *
 */
const saveTransaction = (transactionHistory) => {
  transactionHistoryStore.push(transactionHistory);
};

/**
 * Increases the user's account balance with the specified amount
 * @param accountId uuid
 * @param amount number
 *
 * @return object
 */
const creditUserAccount = (accountId, amount) => {
  const account = accountStore.find((acc) => accountId === acc.id);

  account.balance += amount;
  account.effectiveDateTime = new Date();

  saveTransaction({ ...account, amount, type: 'credit' });

  return { ...account };
};

/**
 * Decreases the user's account balance with the specified amount
 * @param accountId uuid
 * @param amount number
 *
 * @return object
 */
const debitUserAccount = (accountId, amount) => {
  const account = accountStore.find((acc) => accountId === acc.id);
  if (account.balance < amount) {
    throwError('Insufficient amount', 422);
  }

  account.balance -= amount;
  account.effectiveDateTime = new Date();

  saveTransaction({ ...account, amount, type: 'debit' });
  return { ...account };
};

/**
 * Retrieves the account balance
 * @param accountId uuid
 *
 * @returns accountBalance - object
 */
const getAccountBalance = (accountId) => {
  if (lock.isBusy(accountId)) throwError('Service Unavailable', 503);

  const accountBalance = accountStore.find((account) => accountId === account.id).balance;
  return { accountBalance };
};

/**
 * Retrieves the user account details
 * @param accountId uuid
 *
 * @returns accountDetails - object
 */
const getAccountDetails = (accountId) => {
  if (lock.isBusy(accountId)) throwError('Service Unavailable', 503);

  return { ...accountStore.find((account) => accountId === account.id) };
};

/**
 * Retrieves the transaction history for an account
 * @param email
 * @param password
 *
 * @returns transactionHistory - List
 */
const getTransactionHistory = (accountId) => {
  if (lock.isBusy(accountId)) throwError('Service Unavailable', 503);
  return { transactionHistory: [...transactionHistoryStore.filter((tH) => tH.id === accountId)] };
};

/**
 * initiates a transaction
 * @param accountId
 * @param args
 *
 * @returns accountDetails - Object
 */
const initiateTransaction = (accountId, args) => lock.acquire(accountId, () => {
  const { type, amount } = args;

  if (Number.isNaN(amount) || !['credit', 'debit'].includes(type)) throwError('Invalid input', 400);

  if (type === 'credit') return creditUserAccount(accountId, amount);
  return debitUserAccount(accountId, amount);
}).catch((error) => {
  logger.error('Service::initiateTransaction::error', error);
  throw error;
});

exports.bankService = {
  getAccountBalance: (accountId) => getAccountBalance(accountId),
  getAccountDetails: (accountId) => getAccountDetails(accountId),
  getTransactionHistory: (accountId) => getTransactionHistory(accountId),
  initiateTransaction: (accountId, args) => initiateTransaction(accountId, args),
};
