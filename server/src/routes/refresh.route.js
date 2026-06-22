import { Router } from "express";
import { handleRefreshToken } from "../controllers/refresh.token.controller";

const router = Router();

router.get('/', handleRefreshToken);

export default router;