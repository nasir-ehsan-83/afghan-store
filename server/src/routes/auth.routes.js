import { Router } from "express"; 

import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import {
    handleLoginUser, 
    handleRefreshToken,
    handleLogoutUser 
} from "../controllers/auth.controller.js"




const router = Router();

router.post(
    "/login", 
    validateRequest(loginSchema), 
    handleLoginUser
);
router.get(
    '/', 
    handleRefreshToken
);
router.get(
    "/logout", 
    handleLogoutUser
);

export default router;