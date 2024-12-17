import express from "express";
import userRoute from "./usersRoute.js";
import itemRoute from "./itemsRoute.js";
import authRoute from "./authRoute.js";
import { adminOnly, verifyUser } from "../middleware/Auth.js";

const routes = express.Router();

routes.use("/users", verifyUser, adminOnly, userRoute);
routes.use("/items", verifyUser, itemRoute);
routes.use("/auth", authRoute);

export default routes;
