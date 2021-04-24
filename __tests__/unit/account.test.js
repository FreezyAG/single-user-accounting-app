/* eslint-disable no-undef */
const { bankService } = require('../../src/services/account');
const { resetDB } = require('../utils/util');

const { accountStore, transactionHistoryStore } = require('../../src/db/database');

beforeAll(() => resetDB(accountStore, transactionHistoryStore));

beforeEach(() => resetDB(accountStore, transactionHistoryStore));

describe('Single User Accounting System', () => {
  const accountId = 'afca119c-98b8-4714-8639-a4c323bf1c4b';

  describe('getAccountBalance', () => {
    it('returns user account balance', async () => {
      const accountBalance = await bankService.getAccountBalance(accountId);

      expect(accountBalance).toStrictEqual({ accountBalance: 10000 });
    });
  });

  describe('getAccountDetails', () => {
    it('returns user account details', async () => {
      const accountDetails = await bankService.getAccountDetails(accountId);

      expect(accountDetails.id).toBe(accountId);
      expect(accountDetails.balance).toBe(10000);
    });
  });

  describe('getTransactionHistory', () => {
    it('returns user transaction history', async () => {
      await bankService.initiateTransaction(accountId, { type: 'credit', amount: 1000 });
      await bankService.initiateTransaction(accountId, { type: 'debit', amount: 1000 });
      const { transactionHistory } = await bankService.getTransactionHistory(accountId);

      expect(transactionHistory).toBeArrayOfSize(2);
      expect(transactionHistory[0].type).toBe('credit');
      expect(transactionHistory[1].type).toBe('debit');
    });
  });

  describe('initiateTransaction', () => {
    beforeEach(() => {
      resetDB(accountStore, transactionHistoryStore);
    });

    it('credit the user with the stipulated amount when type is credit', async () => {
      const transaction = await bankService.initiateTransaction(accountId, { type: 'credit', amount: 1000 });

      expect(transaction.balance).toBe(11000);
    });

    it('debits the user with the stipulated amount when type is debit', async () => {
      const transaction = await bankService.initiateTransaction(accountId, { type: 'debit', amount: 1000 });

      expect(transaction.balance).toBe(9000);
    });

    it('does not perform debit operation when account balance is less than debit amount', async () => {
      await expect(bankService.initiateTransaction(accountId, { type: 'debit', amount: 20000 }))
        .rejects.toThrowError('Insufficient amount');
    });
  });
});
