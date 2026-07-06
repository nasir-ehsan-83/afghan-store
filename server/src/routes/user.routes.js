import { Router } from "express";

import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateResponse } from "../middlewares/validate.response.middleware.js";
import { checkRole } from "../middlewares/role.check.middleware.js";
import { getCurrentUser } from "../middlewares/current.user.middleware.js";
import { 
    createUserSchema,
    userResponseSchema,
    allUsersResponseSchema,
    updateUserSchema,
    getUserParamsSchema
} from "../validators/user.validator.js";
import { 
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";




const router = Router();

router.post(
    "/", 
    validateRequest(createUserSchema), 
    createUser
);
router.use(getCurrentUser);
router.get(
    "/:id", 
    checkRole(["ADMIN", "USER"]), 
    validateRequest(getUserParamsSchema), 
    validateResponse(userResponseSchema), 
    getUser
);
router.get(
    "/", 
    checkRole(["ADMIN"]), 
    validateResponse(allUsersResponseSchema), 
    getAllUsers
);
router.patch(
    "/", 
    checkRole(["USER", "ADMIN"]), 
    validateRequest(updateUserSchema), 
    validateResponse(userResponseSchema), 
    updateUser
);
router.delete(
    "/", 
    checkRole(["USER", "ADMIN"]), 
    deleteUser
);

export default router;