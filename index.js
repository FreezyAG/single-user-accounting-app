/* -------------------------------------------------------------------------- */
/*                              external imports                              */
/* -------------------------------------------------------------------------- */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

/* ---------------------------- internal imports ---------------------------- */
const { port } = require('./src/config/config');
const logger = require('./src/lib/logger');
const { cors } = require('./src/middleware/utils');
const { globalErrorHandler } = require('./src/utils/error');

const accountRoute = require('./src/routes/account');
const routeNotFound = require('./src/controller/routeNotFound');

const app = express();

app.use(morgan('tiny'));

// cors
app.use(cors);

app.use(bodyParser.json());

// Routes
app.use('/api', accountRoute);

app.use('*', routeNotFound);

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => logger.info(`server connected at port: ${port}`));
