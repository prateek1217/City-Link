import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { register, login  , logout , getProfile} from "../controllers/user.controller.js";

const router = Router();

router.post('/register' , register);
router.post('/login' , login);
router.get('/logout' , logout);
router.get('/me' , isLoggedIn  ,getProfile);

export default router;