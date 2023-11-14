const { validationResult } = require("express-validator");
const Course = require("../models/courses.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

//get all courses
const getAllcourses = asyncWrapper(async (req, res) => {
   //Pagination
   const query = req.query;
   const limit = query.limit;
   const page = query.page;
   const skip = (page - 1) * limit;

   const courses = await Course.find({}, { __v: false })
      .limit(limit)
      .skip(skip);
   res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

//get single course
const getCourse = asyncWrapper(async (req, res, next) => {
   const course = await Course.findById(req.params.courseId);

   if (!course) {
      const error = appError.create(
         "not found course",
         404,
         httpStatusText.FAIL
      );
      return next(error);
   }

   return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

//create a course
const addCourse = asyncWrapper(async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      const error = appError.create(errors.array(), 400, httpStatusText.FAIL);

      return next(error);
   }
   const newCourse = new Course(req.body);
   await newCourse.save();
   res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { newCourse },
   });

   return res.status(400).json({
      status: httpStatusText.ERROR,
      message: error.message,
      data: null,
      code: 400,
   });
});

// update course
const updateCourse = asyncWrapper(async (req, res) => {
   const courseId = +req.params.courseId;
   const updatedCourse = await Course.findByIdAndUpdate(courseId, {
      $set: { ...req.body },
   });
   return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { course: updatedCourse },
   });
});

// delete course
const deleteCourse = asyncWrapper(async (req, res) => {
   await Course.deleteOne({ _id: req.params.courseId });
   res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: null,
   });
});

module.exports = {
   getAllcourses,
   getCourse,
   addCourse,
   updateCourse,
   deleteCourse,
};
