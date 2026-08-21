import { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
  verifyEmail,
  refreshAccessToken,
  getCurrentUser,
  resendEmailVerification,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
//unsecured route
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verficationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);

//secure routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/current-user").post(verifyJwt, getCurrentUser);
router
  .route("/resend-email-verification")
  .post(verifyJwt, resendEmailVerification);
export default router;

