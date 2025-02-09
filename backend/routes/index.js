import express from "express";
import userRoute from "./usersRoute.js";
import itemRoute from "./itemRoute.js";
import authRoute from "./authRoute.js";
import machineRoute from "./machinesRoute.js";
import { adminOnly, verifyUser } from "../middleware/Auth.js";
import sectionRoute from "./sectionRoute.js";
import historyRoute from "./historyRoute.js";
import itemUseHistoryRoute from "./itemUseHistoryRoute.js";
import vendorRoute from "./vendorRoute.js";
import itemHistoryRoute from "./itemHistoryRoute.js";

const routes = express.Router();

// routes.use("/users", verifyUser, adminOnly, userRoute);
routes.use("/users", userRoute);
routes.use("/items", verifyUser, itemRoute);
routes.use("/auth", authRoute);
routes.use("/machines", verifyUser, machineRoute);
routes.use("/sections", verifyUser, sectionRoute);
routes.use("/vendors", verifyUser, vendorRoute);
routes.use("/history", verifyUser, historyRoute);
routes.use("/item-histories", verifyUser, itemHistoryRoute);
routes.use("/item-use-histories", verifyUser, itemUseHistoryRoute);

routes.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is Connected!" });
});

export default routes;
