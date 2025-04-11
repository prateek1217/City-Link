import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import  userRoutes  from "./routes/user.routes.js";
import busRoutes  from "./routes/bus.routes.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin:"http://localhost:5173", 
    credentials: true, // Important: Allow cookies to be sent
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use(morgan('dev'));
// routes
app.use('/api/v1/user', userRoutes);
app.use("/api/v1/bus", busRoutes);

app.get("/health-check", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Health-Check : server is running fine.",
  });
});

app.use(errorMiddleware);