/* eslint-disable no-undef */
const { bankService } = require('../../src/services/account');
const { resetDB } = require('../utils/util');

const { accountStore, transactionHistoryStore, testAccountId } = require('../../src/db/database');


beforeAll(() => resetDB({ accountStore, accountId: testAccountId, transactionHistoryStore }));

beforeEach(() => resetDB({ accountStore, accountId: testAccountId, transactionHistoryStore }));

describe('Single User Accounting System', () => {

  describe('getAccountBalance', () => {
    it('returns user account balance', async () => {
      const accountBalance = await bankService.getAccountBalance(testAccountId);

      expect(accountBalance).toStrictEqual({ accountBalance: 10000 });
    });
  });

  describe('getAccountDetails', () => {
    it('returns user account details', async () => {
      const accountDetails = await bankService.getAccountDetails(testAccountId);

      expect(accountDetails.id).toBe(testAccountId);
      expect(accountDetails.balance).toBe(10000);
    });
  });

  describe('getTransactionHistory', () => {
    it('returns user transaction history', async () => {
      await bankService.initiateTransaction(testAccountId, { type: 'credit', amount: 1000 });
      await bankService.initiateTransaction(testAccountId, { type: 'debit', amount: 1000 });
      const { transactionHistory } = await bankService.getTransactionHistory(testAccountId);

      expect(transactionHistory).toBeArrayOfSize(2);
      expect(transactionHistory[0].type).toBe('credit');
      expect(transactionHistory[1].type).toBe('debit');
    });
  });

  describe('initiateTransaction', () => {
    it('credit the user with the stipulated amount when type is credit', async () => {
      const transaction = await bankService.initiateTransaction(testAccountId, { type: 'credit', amount: 1000 });

      expect(transaction.balance).toBe(11000);
    });

    it('debits the user with the stipulated amount when type is debit', async () => {
      const transaction = await bankService.initiateTransaction(testAccountId, { type: 'debit', amount: 1000 });

      expect(transaction.balance).toBe(9000);
    });

    it('does not perform debit operation when account balance is less than debit amount', async () => {
      await expect(bankService.initiateTransaction(testAccountId, { type: 'debit', amount: 20000 }))
        .rejects.toThrowError('Insufficient amount');
    });
  });
});
