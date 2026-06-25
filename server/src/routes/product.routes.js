import { Router } from "express";

import { validateRequest } from "../middlewares/validate.request.middleware";
import { validateResponse } from "../middlewares/validate.response.middleware";
import { checkRole } from "../middlewares/role.check.middleware";
import { getCurrentUser } from "../middlewares/current.user.middleware.js";
import { 
    createProductSchema,
    productResponseSchema,
    allProductsResponseSchema
} from "../validators/product.validator.js";
import { 
    createProduct ,
    getProduct,
    getAllProducts
} from "../controllers/product.controller";

const router = Router();

router.use(getCurrentUser, checkRole(["ADMIN"]));

router.post("/", validateRequest(createProductSchema), validateResponse(productResponseSchema), createProduct)
router.get("/:id", validateResponse(productResponseSchema), getProduct);
router.get("/", validateResponse(allProductsResponseSchema), getAllProducts);

export default router;