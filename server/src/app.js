import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";

// create express's object
const app = express();

// use cors to presmision differint host to connect
app.use(cors({
    origin : ["localhost:3500", "127.0.0.1:3500", "google.com"]
}));

// use json () to parse json files
app.use(express.json());

app.use("/api/auth", authRoutes);

// if there is not provided api
app.use((req, res)=> {
    res.status(404).json({
        error : "Route not found"
    });
});

export default app;