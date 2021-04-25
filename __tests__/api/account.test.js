/* eslint-disable no-undef */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');

const app = express();

const { accountStore, transactionHistoryStore, accountId } = require('../../src/db/database');
const accountRoute = require('../../src/routes/account');
const { resetDB } = require('../utils/util');

app.use(bodyParser.json());
app.use('/api', accountRoute);

beforeAll(() => resetDB({ accountStore, accountId, transactionHistoryStore }));

beforeEach(() => resetDB({ accountStore, accountId, transactionHistoryStore }));

describe('Referral App Integration Test', () => {
  describe('accountBalance', () => {
    async function getAccountBalance() {
      const { body } = await request(app)
        .get('/api/accountBalance');
      return {
        body,
      };
    }
    it('fetches user account balance', async (done) => {
      const { body: responseBody } = await getAccountBalance();

      expect(responseBody).toBeObject();
      expect(responseBody.error).toBe(false);
      expect(responseBody.message).toBe('successful operation');
      expect(responseBody.data.accountBalance).toBe(10000);
      done();
    });
  });

  describe('getAccountDetails', () => {
    async function getAccountDetails() {
      const { body } = await request(app)
        .get(`/api/accountDetails/${accountId}`);
      return {
        body,
      };
    }
    it('fetches user account details', async (done) => {
      const { body: responseBody } = await getAccountDetails();

      expect(responseBody).toBeObject();
      expect(responseBody.error).toBe(false);
      expect(responseBody.message).toBe('successful operation');
      expect(responseBody.data.id).toBe(accountId);
      expect(responseBody.data.balance).toBe(10000);
      done();
    });
  });

  describe('transactionHistory', () => {
    const creditRequestBody = {
      amount: 1000,
      type: 'credit',
    };
    const debitRequestBody = {
      amount: 1000,
      type: 'debit',
    };

    async function initiateTransaction(requestBody) {
      const { body } = await request(app)
        .post('/api/initiateTransaction')
        .send(requestBody);
      return {
        body,
      };
    }
    async function getTransactionHistory() {
      const { body } = await request(app)
        .get('/api/transactionHistory');
      return {
        body,
      };
    }
    it('fetches user transactionHistory', async (done) => {
      const { body: responseBody } = await getTransactionHistory();

      expect(responseBody).toBeObject();
      expect(responseBody.error).toBe(false);
      expect(responseBody.message).toBe('successful operation');
      expect(responseBody.data.transactionHistory).toBeArrayOfSize(0);
      done();
    });

    it('records the transactions on a user account ', async (done) => {
      await initiateTransaction(creditRequestBody);
      await initiateTransaction(debitRequestBody);
      const { body: responseBody } = await getTransactionHistory();

      expect(responseBody).toBeObject();
      expect(responseBody.error).toBe(false);
      expect(responseBody.message).toBe('successful operation');
      expect(responseBody.data.transactionHistory).toBeArrayOfSize(2);
      expect(responseBody.data.transactionHistory[0].type).toBe('credit');
      expect(responseBody.data.transactionHistory[1].type).toBe('debit');
      done();
    });
  });

  describe('initiateTransaction', () => {
    const creditRequestBody = {
      amount: 1000,
      type: 'credit',
    };
    const debitRequestBody = {
      amount: 1000,
      type: 'debit',
    };

    async function initiateTransaction(requestBody) {
      const { body } = await request(app)
        .post('/api/initiateTransaction')
        .send(requestBody);

      return {
        body,
      };
    }
    it('credits the user with the stipulated amount when type is credit', async (done) => {
      const { body: responseBody } = await initiateTransaction(creditRequestBody);

      expect(responseBody).toBeObject();
      expect(responseBody.error).toBe(false);
      expect(responseBody.message).toBe('successful operation');
      expect(responseBody.data.balance).toBe(11000);
      done();
    });

    it('debits the user with the stipulated amount when type is debit', async (done) => {
      const { body: responseBody } = await initiateTransaction(debitRequestBody);

      expect(responseBody).toBeObject();
      expect(responseBody.error).toBe(false);
      expect(responseBody.message).toBe('successful operation');
      expect(responseBody.data.balance).toBe(9000);
      done();
    });
  });
});
