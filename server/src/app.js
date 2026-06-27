import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/error.handler.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import refreshRoute from "./routes/refresh.route.js";
import usersRoutes from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";

const app = express();

app.use(cors({
    origin : [
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/refresh", refreshRoute);
app.use("/api/users", usersRoutes);
app.use("/api/products", productRoute);

app.use((req, res)=> {
    return res.status(404).json({
        error : "Route not found"
    });
});

app.use(errorHandler);

export default app;