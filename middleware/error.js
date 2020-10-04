const errorHandler = (error, req, res, next) => {

  // Log to console for dev
  console.log(error);

  const errorStatus = error.statusCode || 500;

  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: error.message
  });

}

module.exports = errorHandler;
