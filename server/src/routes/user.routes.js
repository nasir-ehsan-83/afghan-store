import { Router } from "express";

import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema } from "../validators/user.validator.js";
import { createUser } from "../controllers/user.controller.js";

const router = Router();

router.post("/", validate(createUserSchema), createUser);

export default router;