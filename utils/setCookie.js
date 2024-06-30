exports.setCookie = async (req, res, next) => {
  return (cookieVal) => {
    res.cookie("jwt", cookieVal, {
      httpOnly: true,
    })
  }
}