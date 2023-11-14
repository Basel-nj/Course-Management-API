const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { verifytoken } = require("../middlewares/verfiyToken");
const multer = require("multer");
const appError = require("../utils/appError");

const diskStorage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads");
   },
   // to handle the same name problem
   filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const filename = `user-${Date.now()}.${ext}`;
      cb(null, filename);
   },
});

const fileFilter = (req, file, cb) => {
   const fileType = file.mimetype.split("/")[0];
   if (fileType === "image") {
      return cb(null, true);
   } else {
      const error = appError.create("file type must be an image", 400);
      return cb(error, false);
   }
};

const uploads = multer({
   storage: diskStorage,
   fileFilter,
});

//get all users
router.route("/").get(verifytoken, usersController.getAllUsers);

//register
router
   .route("/register")
   .post(uploads.single("avatar"), usersController.register);

//login
router.route("/login").post(usersController.login);

module.exports = router;
