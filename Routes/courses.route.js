const express = require("express");
const router = express.Router();

const { validationSchema } = require("../middlewares/validationSchema");
const courseContollers = require("../controllers/courses.conroller");
const { verifytoken } = require("../middlewares/verfiyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

router
   .route("/")
   .get(courseContollers.getAllcourses)
   .post(verifytoken, validationSchema(), courseContollers.addCourse);

router
   .route("/:courseId")
   .get(courseContollers.getCourse)
   .patch(courseContollers.updateCourse)
   .delete(
      verifytoken,
      allowedTo(userRoles.ADMIN, userRoles.MANAGER),
      courseContollers.deleteCourse
   );

module.exports = router;
