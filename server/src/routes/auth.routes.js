import { Router } from "express"; 
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import {
    handleLoginUser, 
    handleLogoutUser 
} from "../controllers/auth.controller.js"

const router = Router();

router.post("/login", validate(loginSchema), handleLoginUser);
router.get("/logout", handleLogoutUser)

export default router;