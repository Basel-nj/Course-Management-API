const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const allowedTo = (...roles) => {
   return (req, res, next) => {
      const currentRole = req.currentUser.role;

      if (roles.includes(currentRole)) {
         console.log("accessed");
         next();
      } else {
         const error = appError.create(
            "couldnot access to this routes",
            400,
            httpStatusText.ERROR
         );
         return next(error);
      }
   };
};

module.exports = allowedTo;
