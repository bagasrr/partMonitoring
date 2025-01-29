import express from "express";
import { createVendor, getVendorById, getVendors, softDeleteVendor, updateVendor } from "../controller/vendors.js";

const vendorRoute = express.Router();

vendorRoute.get("/", getVendors);
vendorRoute.post("/", createVendor);
vendorRoute.get("/:uuid", getVendorById);
vendorRoute.patch("/:uuid/edit", updateVendor);
vendorRoute.patch("/:uuid/delete", softDeleteVendor);

export default vendorRoute;
