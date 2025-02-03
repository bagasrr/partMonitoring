import express from "express";
import { createUser, deleteUser, getAllUser, getUserById, updateUser } from "../controller/users.js";
// import { adminOnly, verifyUser } from "../middleware/Auth.js";

const userRoute = express.Router();

userRoute.get("/", getAllUser);
userRoute.get("/:id", getUserById);
userRoute.post("/", createUser);
userRoute.patch("/:id", updateUser);
userRoute.patch("/:id/delete", deleteUser);

export default userRoute;
