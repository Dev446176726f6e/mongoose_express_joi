const ApiError = require("../errors/api_error");

module.exports = function (err, req, res, next) {
   // console.log(err); nazarda tutilmagan, xatoliklarni dastur to'xtab qolmasligi uchun.
   // terminalda birinchi tutib olib. keyin bu yerda qo'shib qo'ysak bo'ladi.
   

  if (err instanceof ApiError) {
    return res.status(err.status).send({ message: err.message });
  }

  if (err instanceof SyntaxError) {
    return res.status(err.status).send({ message: err.message });
  }

  return res.status(500).send({ message: "Unintended error" });
};
