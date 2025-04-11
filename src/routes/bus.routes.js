import express from "express";
import AppError from "../utils/error.utils.js";
import { Bus } from "../models/bus.model.js";
import { addBus, searchBus } from "../controllers/bus.controller.js";
import { authorizeRoles, isAuth } from "../middlewares/auth.middleware.js";

const busRouter = express.Router();

busRouter.post("/add-bus", isAuth, authorizeRoles("SUPER-ADMIN"), addBus);

busRouter.get("/search-buses", searchBus);

export default busRouter;
