"use strict";

const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const authentication = require("basic-auth");

const User = require("./models").User;
const Course = require("./models").Course;

//error handler middlerware
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

//User authitfication
const authenticateUser = async (req, res, next) => {
  let message = null;
  const users = await User.findAll();
  const credentials = authentication(req);
  if (credentials) {
    const user = users.find((user) => user.emailAddress === credentials.name);
    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );
        req.currentUser = user;
      } else {
        message = `Authentication failed for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Authorization header not found";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};

//USER ROUTES for UserSignIn

router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const authUser = req.currentUser;
    const user = await User.findByPk(authUser.id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  })
);

//POST USER for Sign Up
router.post(
  "/user",
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const user = req.body;
      if (user.password) {
        user.password = bcryptjs.hashSync(user.password);
      }
      let createduser = await User.create(req.body);
      res.status(200).json({
        message: "User created successfully",
        createduser: createduser,
      });
      //res.status(201).location("/").end();
    }
  })
);

// COURSES ROUTES

//GET COURSES
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
    });
    res.json(courses);
  })
);

//GET Courses by ID
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
    });
    res.status(200).json(course);
  })
);

//POST (CREATE) Course
router.post(
  "/courses/create",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).json(course);
      // res
      //   .status(201)
      //   .location("/courses/" + course.id)
      //   .end();
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//PUT(Update) Courses
router.put(
  "/courses/update/:id",
  authenticateUser,
  [
    check("title").not().isEmpty().withMessage("Please provide a title"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Please provide a description"),
    check("userId")
      .not()
      .isEmpty()
      .withMessage("Please provide a value for User Id"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if there are validation errors such as a title is empty
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const authUser = req.currentUser;
      const course = await Course.findByPk(req.params.id);
      if (authUser.id === course.userId) {
        const updatedcourse = await course.update(req.body);
        res.status(200).json({ id: updatedcourse });
      } else {
        res.status(403).json({
          errors: [
            "Unfortunatley you can only make changes to your own courses.",
          ],
        });
      }
    }
  })
);

//DELETE Course ID, return no page
router.delete(
  "/courses/delete/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const authUser = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (authUser.id === course.userId) {
        await course.destroy();
        res.status(200).json({ successmessage: "Course has been deleted." });
      } else {
        res.status(403).json({
          message: "Sorry. You can only make changes to your own courses.",
        });
      }
    } else {
      next(); //
    }
  })
);

module.exports = router;
