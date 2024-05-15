import express from "express";
import usercontroller from "../controllers/usercontroller.js";
import validators from "../common/validators.js";

const router = express.Router();

router.post("/signup", validators.validate("signup"), validators.validationMiddleware, usercontroller.signup);
router.post("/signin", validators.validate("signin"), validators.validationMiddleware,usercontroller.signin);
router.post("/forgot-password", validators.validate("forgotPassword"), validators.validationMiddleware,usercontroller.forgotPassword);
router.post("/reset-password", validators.validate("resetpassword"),validators.validationMiddleware,usercontroller.resetPassword);

export default router;