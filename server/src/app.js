import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/error.handler.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import refreshRoute from "./routes/refresh.route.js";
import usersRoutes from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";
import cartRoute from "./routes/cart.routes.js";
import addressRoute from "./routes/address.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,              
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"]  
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/refresh", refreshRoute);
app.use("/api/users", usersRoutes);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute)
app.use("/api/address", addressRoute);

app.use((req, res)=> {
    return res.status(404).json({
        error : "Route not found"
    });
});

app.use(errorHandler);

export default app;