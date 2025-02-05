import { historyModel, userModel, vendorModel } from "../models/index.js";
import { logAuditEvent } from "./sections.js";

export const createVendor = async (req, res) => {
  try {
    if (req.role !== "admin") return res.status(403).json({ message: "You are not allowed to this function" });
    const { vendor_name } = req.body;

    const vendor = await vendorModel.findOne({ where: { vendor_name, deletedAt: null } });
    if (vendor) return res.status(400).json({ message: "Vendor already exists" });

    const userId = req.userId; // Ambil userId dari middleware
    const newVendor = await vendorModel.create({ vendor_name, userId });
    historyModel.create({
      name: vendor_name,
      changeType: "Create",
      category: "Vendor",
      username: req.name,
      description: `Vendor created by ${req.name}`,
    });
    await logAuditEvent("Vendor", newVendor.id, "create", { vendor_name: vendor_name });
    res.status(201).json({ message: "create success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.findAll({ where: { deletedAt: null }, attributes: ["uuid", "vendor_name", "deletedAt"], include: [{ model: userModel, attributes: ["name", "role"] }] });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { uuid } = req.params;
    const vendor = await vendorModel.findOne({ where: { uuid, deletedAt: null }, attributes: ["uuid", "vendor_name"], include: [{ model: userModel, attributes: ["name", "role"] }] });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { vendor_name } = req.body;
    const userId = req.userId; // Ambil userId dari middleware
    const vendor = await vendorModel.findOne({ where: { uuid, deletedAt: null } });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    await vendor.update({ vendor_name, userId });

    historyModel.create({
      name: vendor.vendor_name,
      changeType: "Update",
      category: "Vendor",
      username: req.name,
      description: `Vendor updated by ${req.name}`,
    });
    await logAuditEvent("Vendor", vendor.id, "update", { vendor_name: vendor.vendor_name });

    res.status(200).json({ message: "Vendor updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const softDeleteVendor = async (req, res) => {
  if (req.role !== "admin") return res.status(403).json({ message: "You are not allowed to this function" });
  try {
    const { uuid } = req.params;
    const vendor = await vendorModel.findOne({ where: { uuid, deletedAt: null } });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    await vendorModel.update({ deletedAt: new Date() }, { where: { id: vendor.id } });

    await historyModel.create({
      name: vendor.vendor_name,
      changeType: "Delete",
      category: "Vendor",
      username: req.name,
      description: `Vendor deleted by ${req.name}`,
    });
    await logAuditEvent("Vendor", vendor.id, "delete", { vendor_name: vendor.vendor_name });

    res.status(200).json({ message: "Vendor soft deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
