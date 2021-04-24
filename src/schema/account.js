/* -------------------------------------------------------------------------- */
/*                              external imports                              */
/* -------------------------------------------------------------------------- */
const Joi = require('@hapi/joi');

exports.transactionBody = Joi.object({

  type: Joi.string()
    .required(),

  amount: Joi.number()
    .required(),
});
