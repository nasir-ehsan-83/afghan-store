import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/error.handler.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import refreshRoute from "./routes/refresh.route.js";
import usersRoutes from "./routes/user.routes.js"

// create express's object
const app = express();

// use cors to presmision differint host to connect
app.use(cors({
    origin : ["localhost:3500", "127.0.0.1:3500", "google.com"]
}));

// use json () to parse json files
app.use(express.json());

// add error-handler middleware
app.use(errorHandler);

// add routes from src/routes/*
app.use("/api/auth", authRoutes);
app.use("/api/refresh", refreshRoute);
app.use("/api/users", usersRoutes)
// if there is not provided api
app.use((req, res)=> {
    res.status(404).json({
        error : "Route not found"
    });
});

export default app;