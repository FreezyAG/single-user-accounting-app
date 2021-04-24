exports.sendFailureResponse = (error, next) => {
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  next(error);
};

exports.sendSuccessResponse = (res, message, data = null) => {
  res.status(200).json({
    error: false,
    message,
    data
  });
};
