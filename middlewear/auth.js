import jwt from "jsonwebtoken";
import userModel from "../DB/model/user.js";
export const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization?.startsWith(process.env.spilitAuthorization)) {
        res.json({ message: "In-valid token or In-valid BarerToken" });
      } else {
        const token = authorization.split(process.env.spilitAuthorization)[1];
        const decoded = jwt.verify(token, process.env.tokenSagniture);
        console.log(decoded);
        if (!decoded?.isLoggedIn || !decoded.id) {
          res.json({ message: "Token expired"});
        } else {
          const user = await userModel
            .findById(decoded.id)
            .select("firstName lastName email ");
          if (!user) {
            res.json({ message: "Invalid token user" });
          } else {
            req.user = user;
            next();
          }
        }
      }
    } catch (error) {
      res.json({ message: "Catch error", error });
    }
  };
};
