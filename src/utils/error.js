exports.globalErrorHandler = (error, _req, res, _next) => {
  const status = error.statusCode || 500;
  const {message} = error;
  const {data} = error;

  res.status(status).json({
    error: true,
    statusCode: status,
    message,
    data,
  });
};

exports.throwError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
