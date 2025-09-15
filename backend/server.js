import "./envConfig.js";
import express from "express";
import {checkConnection} from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

checkConnection();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",userRoutes);
app.use("/api/auth",productRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log(`APP IS LISTENISTING AT localhost:${port}`));