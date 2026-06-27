import { Router } from "express";

import { validateRequest } from "../middlewares/validate.request.middleware.js";
import { validateResponse } from "../middlewares/validate.response.middleware.js";
import { checkRole } from "../middlewares/role.check.middleware.js";
import { getCurrentUser } from "../middlewares/current.user.middleware.js";
import { 
    createProductSchema,
    productResponseSchema,
    allProductsResponseSchema,
    updateProductSchema
} from "../validators/product.validator.js";
import { 
    createProduct ,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";




const router = Router();

router.get(
    "/:id", 
    validateResponse(productResponseSchema), 
    getProduct
);
router.get(
    "/", 
    validateResponse(allProductsResponseSchema), 
    getAllProducts
);
router.use(
    getCurrentUser, 
    checkRole(["ADMIN"])
);
router.post(
    "/", 
    validateRequest(createProductSchema), 
    validateResponse(productResponseSchema), 
    createProduct
);
router.patch(
    "/:id", 
    validateRequest(updateProductSchema), 
    validateResponse(productResponseSchema), 
    updateProduct
);
router.delete(
    "/:id", 
    deleteProduct
);

export default router;