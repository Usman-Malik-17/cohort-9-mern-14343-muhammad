import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long"),
    body("fullName").trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const createNoteValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),

    body("content").trim().notEmpty().withMessage("Content is required"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),
  ];
};

const updateNoteValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),

    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Content cannot be empty"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  createNoteValidator,
  updateNoteValidator,
};
