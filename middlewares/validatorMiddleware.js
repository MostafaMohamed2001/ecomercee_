const { validationResult } = require('express-validator');
const validatorMiddleWare = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors[0].msg)
    return res.status(400).json({ errors: errors.array() });
  }
  
  next();
};
module.exports = validatorMiddleWare;