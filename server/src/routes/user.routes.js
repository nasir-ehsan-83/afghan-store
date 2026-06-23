import { Router } from "express";

import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateResponse } from "../middlewares/validate.response.middleware.js";
import { checkRole } from "../middlewares/role.check.middleware.js";
import { getCurrentUser } from "../middlewares/current.user.middleware.js";
import { createUserSchema } from "../validators/user.validator.js";
import { 
    createUser,
    getUser,
    getAllUsers
} from "../controllers/user.controller.js";

const router = Router();

router.post("/", validateRequest(createUserSchema), createUser);

router.use(getCurrentUser);

router.get("/:id", checkRole(["ADMIN", "USER"]), validateResponse(getUser));
router.get("/", checkRole(["ADMIN"]), validateResponse(getAllUsers));

export default router;