import express from "express";
import {saveUser,getAllUsers,deleteUserById,loginUser,getUserProfile,logoutUser} from "../controller/userController.js";
import {verifyAccessToken,verifyRefreshToken} from "../middleware/authMiddleware.js";
import { registrationValidator } from "../validator/registration.Validation.js";
import { validationErrorHandler } from "../middleware/validationError.middleware.js";

const router = express.Router();

router.post("/registerUser",registrationValidator,validationErrorHandler,saveUser);
router.get("/getAllUsers",getAllUsers);
router.delete("/deleteUserById",deleteUserById);
router.post("/loginUser",loginUser);
router.get("/getUserProfile",verifyAccessToken,getUserProfile);
router.delete("/logoutUser",logoutUser);
router.get("/refreshToken",verifyRefreshToken); 

export default router;