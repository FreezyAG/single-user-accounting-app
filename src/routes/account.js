/* -------------------------------------------------------------------------- */
/*                              external imports                              */
/* -------------------------------------------------------------------------- */
const express = require('express');

/* ---------------------------- internal imports ---------------------------- */
const {
  getAccountBalance,
  getAccountDetails,
  getTransactionHistory,
  initiateTransaction
} = require('../controller/account');
const validate = require('../middleware/validation');
const { transactionBody } = require('../schema/account');

const router = express.Router();

router.get('/accountBalance', getAccountBalance);
router.get('/accountDetails/:accountId', getAccountDetails);
router.get('/transactionHistory', getTransactionHistory);
router.post('/initiateTransaction', validate(transactionBody), initiateTransaction);

module.exports = router;
