const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service");

module.exports = async function (roles) {
  return async function (req, res, next) {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(403).send({ message: "Token is not provided" });
      }
      // console.log(authorization);
      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (bearer != "Bearer" || !token) {
        return res.status(403).send({ message: "Wrong token" });
      }
      const [error, decodedToken] = await to(myJwt.verifyAccessToken(token));
      // console.log(decodedToken);
      if (error) {
        return res.status(403).send({ message: error.message });
      }
      req.author = decodedToken;
      const { is_expert, author_roles } = decodedToken;
      let hasRole = false;
      author_roles.forEach((author_role) => {
        if (roles.includes(author_role)) hasRole = true;
      });

      if (!is_expert || !hasRole) {
        return res.status(401).send({ message: "Forbidden: access denied" });
      }
      
      next();
    } catch (error) {
      console.log(error);
      res.status(403).send({ message: "Author is not registered" });
    }
  };
};
