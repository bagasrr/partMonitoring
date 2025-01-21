import express from "express";
import userRoute from "./usersRoute.js";
import itemRoute from "./itemRoute.js";
import authRoute from "./authRoute.js";
import machineRoute from "./machinesRoute.js";
import { adminOnly, verifyUser } from "../middleware/Auth.js";
import sectionRoute from "./sectionRoute.js";
import historyRoute from "./historyRoute.js";

const routes = express.Router();

routes.use("/users", verifyUser, adminOnly, userRoute);
routes.use("/items", verifyUser, itemRoute);
routes.use("/auth", authRoute);
routes.use("/machines", verifyUser, machineRoute);
routes.use("/sections", verifyUser, sectionRoute);
routes.use("/history", verifyUser, historyRoute);

export default routes;
