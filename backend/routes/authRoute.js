import express from "express";
import { login, logout, Me } from "../controller/Auth.js";

const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.delete("/logout", logout);
authRoute.get("/me", Me);

export default authRoute;
