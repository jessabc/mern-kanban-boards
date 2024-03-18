import express from "express";
import { signup, login } from "../controllers/userController.js";

export const router = express.Router();

// signup
router.post("/signup", signup);

// lognin
router.post("/login", login);
