import { Router } from "express";

import { getCurrentUser } from "../middlewares/current.user.middleware.js";
import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateResponse } from "../middlewares/validate.response.middleware.js";
import { 
    addToCartSchema,
    cartResponse
} from "../validators/cart.validator.js";
import { 
    addToCart,
    removeItem,
    updateQuantity,
    getCart
} from "../controllers/cart.controller.js";




const router = Router();

router.use(getCurrentUser);

router.post(
    "/add", 
    validateRequest(addToCartSchema), 
    validateResponse(cartResponse), 
    addToCart
);
router.get(
    "/:userId", 
    validateResponse(cartResponse), 
    getCart
);
router.patch(
    "/item/update", 
    validateRequest(addToCartSchema), 
    validateResponse(cartResponse), 
    updateQuantity
);
router.delete(
    "/item/remove", 
    validateRequest(addToCartSchema), 
    validateResponse(cartResponse), 
    removeItem
);

export default router;