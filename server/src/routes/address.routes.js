import { Router } from "express";

import { getCurrentUser } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateResponse } from "../middlewares/validate.response.middleware.js";
import {
    createAddressSchema,
    addressParamsSchema,
    addressResponseSchema
} from "../validators/address.validator.js";
import {
    saveAddress,
    getAddress
} from "../controllers/address.controller.js";




const router = Router();

router.use(getCurrentUser);

router.post(
    "/add", 
    validateRequest(createAddressSchema), 
    validateResponse(addressResponseSchema), 
    saveAddress
);

router.get(
    "/:userId", 
    validateRequest(addressParamsSchema), 
    validateResponse(addressResponseSchema), 
    getAddress
);

export default router;
