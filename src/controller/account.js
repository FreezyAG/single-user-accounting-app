/* -------------------------------------------------------------------------- */
/*                              external imports                              */
/* -------------------------------------------------------------------------- */
const halson = require('halson');

/* ---------------------------- internal imports ---------------------------- */
const { bankService } = require('../services/account');
const { accountId } = require('../db/database');
const {
  sendSuccessResponse,
  sendFailureResponse,
} = require('../utils/response');

exports.getAccountBalance = (req, res, next) => {
  try {
    const accountBalance = halson(bankService.getAccountBalance(accountId))
      .addLink('self', '/api/accountBalance')
      .addLink('getAccountDetails', { href: 'http://localhost:3000/api/accountDetails/:accountId', method: 'GET', param: 'uuid' })
      .addLink('getTransactionHistory', { href: 'http://localhost:3000/api/TransactionHistory', method: 'GET' })
      .addLink('initiateTransaction', { href: 'http://localhost:3000/api/initiateTransaction', method: 'POST' })

    sendSuccessResponse(res, 'successful operation', accountBalance);
  } catch (error) {
    sendFailureResponse(error, next);
  }
};

exports.getAccountDetails = (req, res, next) => {
  try {
    const transaction = halson(bankService.getAccountDetails(req.params.accountId = accountId))
      .addLink('self', 'http://localhost:3000/api/accountDetails/:accountId')
      .addLink('getAccountBalance', { href: 'http://localhost:3000/api/accountBalance', method: 'GET' })
      .addLink('getTransactionHistory', { href: 'http://localhost:3000/api/TransactionHistory', method: 'GET' })
      .addLink('initiateTransaction', { href: 'http://localhost:3000/api/initiateTransaction', method: 'POST' })

    sendSuccessResponse(res, 'successful operation', transaction);
  } catch (error) {
    sendFailureResponse(error, next);
  }
};

exports.getTransactionHistory = (_, res, next) => {
  try {
    const transactionHistory = halson(bankService.getTransactionHistory(accountId))
      .addLink('self', 'http://localhost:3000/api/TransactionHistory')
      .addLink('getAccountBalance', { href: 'http://localhost:3000/api/accountBalance', method: 'GET' })
      .addLink('getAccountDetails', { href: 'http://localhost:3000/api/accountDetails/:accountId', method: 'GET', param: 'uuid' })
      .addLink('initiateTransaction', { href: 'http://localhost:3000/api/initiateTransaction', method: 'POST' })

    sendSuccessResponse(res, 'successful operation', transactionHistory);
  } catch (error) {
    sendFailureResponse(error, next);
  }
};

exports.initiateTransaction = (req, res, next) => {
  bankService.initiateTransaction(accountId, req.body)
    .then((successfulTransaction) => halson(successfulTransaction)
      .addLink('self', 'http://localhost:3000/api/initiateTransaction')
      .addLink('getAccountBalance', { href: 'http://localhost:3000/api/accountBalance', method: 'GET' })
      .addLink('getAccountDetails', { href: 'http://localhost:3000/api/accountDetails/:accountId', method: 'GET', param: 'uuid' })
      .addLink('getTransactionHistory', { href: 'http://localhost:3000/api/TransactionHistory', method: 'GET' }))
    .then((response) => sendSuccessResponse(res, 'successful operation', response))
    .catch((error) => {
      sendFailureResponse(error, next);
    });
};
