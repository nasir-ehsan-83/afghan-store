import express from "express"; 
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";
import { registerController } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", validate(registerSchema), registerController);

export default router;