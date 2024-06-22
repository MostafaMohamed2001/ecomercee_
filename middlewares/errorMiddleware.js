const ApiError = require('./../utils/apiError');

const handleJwtInvalidSignature = () => 
  new ApiError('Invalid Token ,please login again ...',401)
const handleJwtExpire = () => 
  new ApiError('Expires Token , please login again ...',401)

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err=handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err=handleJwtExpire();
    sendErrorProd(err, res);  
  }
};     
 
const sendErrorDev = (err, res) => {
 
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}; 
const sendErrorProd = (err, res) => {
  // console.log("fsfsrfse")
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,

  });
};

module.exports = globalError;
