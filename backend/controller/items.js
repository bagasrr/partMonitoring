import { historyModel, itemModel, machineModel, sectionModel, userModel, AuditLogModel } from "../models/index.js";
import { Op } from "sequelize";
import { checkStockLevels } from "../services/mailsent.js"; // Import stock alert utility

const logAuditEvent = async (entityType, entityId, action, details) => {
  try {
    await AuditLogModel.create({
      entityType,
      entityId,
      action,
      details,
    });
  } catch (error) {
    console.error("Error logging audit event:", error);
  }
};

export const getAllItems = async (req, res) => {
  try {
    const response = await itemModel.findAll({
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit"],
      where: {
        deletedAt: null, // Exclude soft-deleted items
      },
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
        {
          model: machineModel,
          attributes: ["uuid", "machine_name", "machine_number"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await itemModel.findOne({
      where: {
        uuid: req.params.id,
        deletedAt: null, // Exclude soft-deleted items
      },
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit"],
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
        {
          model: machineModel,
          attributes: ["uuid", "machine_name", "machine_number"],
        },
      ],
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  const { name, amount, description, status, lowerLimit, machine_name, machine_number, section_name, section_number } = req.body;

  try {
    // Validate that amount is greater than 0
    if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

    // Find or create machine
    let machine = await machineModel.findOne({ where: { machine_name } });

    if (!machine) {
      // Find or create section
      let section = await sectionModel.findOne({ where: { section_name } });

      if (!section) {
        section = await sectionModel.create({
          section_name,
          section_number,
          userId: req.userId,
        });

        // Create history record for section creation
        await historyModel.create({
          name: section.section_name,
          changeType: "Create Section",
          category: "Section",
          username: req.name,
          description: "Section created",
        });

        // Log the section creation in audit logs
        await logAuditEvent("Section", section.id, "create", {
          section_name: section.section_name,
          section_number: section.section_number,
        });
      }

      machine = await machineModel.create({
        machine_name,
        machine_number,
        sectionId: section.id,
        userId: req.userId,
      });

      // Create history record for machine creation
      await historyModel.create({
        name: machine.machine_name,
        changeType: "Create Machine",
        category: "Machine",
        username: req.name,
        description: "Machine created",
      });

      // Log the machine creation in audit logs
      await logAuditEvent("Machine", machine.id, "create", {
        machine_name: machine.machine_name,
        machine_number: machine.machine_number,
        section_name: section.section_name,
      });
    }

    // Check if item already exists
    const prevItem = await itemModel.findOne({
      where: { name, machineId: machine.id },
    });

    if (prevItem) {
      await itemModel.update({ amount: prevItem.amount + amount }, { where: { id: prevItem.id } });

      // Create history record
      await historyModel.create({
        name,
        changeType: "Increase Item Amount",
        category: "Item",
        username: req.name,
        description,
        prevStock: prevItem.amount,
        newStock: amount,
        afterStock: prevItem.amount + amount,
      });

      // Log the update action in the audit logs
      await logAuditEvent("Item", prevItem.id, "update", {
        name: prevItem.name,
        prevAmount: prevItem.amount,
        newAmount: prevItem.amount + amount,
        description,
      });

      // Check stock levels
      await checkStockLevels();

      return res.status(200).json({ message: "Item amount updated" });
    } else {
      const newItem = await itemModel.create({
        name,
        amount,
        description,
        status,
        lowerLimit,
        userId: req.userId,
        machineId: machine.id,
      });

      // Create history record for new item creation
      await historyModel.create({
        name,
        changeType: "Create New Item",
        category: "Item",
        username: req.name,
        description,
        prevStock: 0,
        newStock: amount,
        afterStock: amount,
      });

      // Log the create action in the audit logs
      await logAuditEvent("Item", newItem.id, "create", {
        name: newItem.name,
        amount: newItem.amount,
        description,
        status,
        lowerLimit,
      });

      // Check stock levels
      await checkStockLevels();

      return res.status(201).json({ message: "Item created", data: newItem });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await itemModel.findOne({
      where: { uuid: req.params.id, deletedAt: null },
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    const { name, amount, description, status, lowerLimit } = req.body;
    let response;

    if (req.role === "admin") {
      response = await itemModel.update({ name, amount, description, status, lowerLimit }, { where: { id: item.id } });
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to update this item" });
      response = await itemModel.update({
         name, amount, description, status, lowerLimit 
        }, { 
          where: { 
            [Op.and]: [{ id: item.id }, { userId: req.userId }] 
          } });
    }

    // Log the update action in the audit logs
    await logAuditEvent("Item", item.id, "update", { name, amount, description, status, lowerLimit });

    // Create history record
    await historyModel.create({
      name,
      changeType: "Update Item",
      category: "Item",
      username: req.name,
      prevStock: 
      description: "Item updated",
    });

    // Check stock levels
    await checkStockLevels();

    res.status(200).json({ message: "Item updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await itemModel.findOne({
      where: {
        uuid: req.params.id,
        deletedAt: null,
      },
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    let response;
    if (req.role === "admin") {
      response = await itemModel.update(
        { deletedAt: new Date() }, // Perform soft delete
        { where: { id: item.id } }
      );
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to delete this, please contact your administrator" });
      response = await itemModel.update(
        { deletedAt: new Date() }, // Perform soft delete
        { where: { [Op.and]: [{ id: item.id }, { userId: req.userId }] } }
      );
    }

    // Create history record
    await historyModel.create({
      name: item.name,
      changeType: "Delete Item",
      category: "Item",
      username: req.name,
      description: "Item deleted",
    });

    // Log the delete action in the audit logs
    await logAuditEvent("Item", item.id, "delete", { name: item.name, amount: item.amount });

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addItemAmount = async (req, res) => {
  const { name, amountToAdd, description } = req.body;

  try {
    // Validate that amountToAdd is greater than 0
    if (amountToAdd <= 0) return res.status(400).json({ message: "Amount to add must be greater than 0" });

    // Find the item by name
    const item = await itemModel.findOne({
      where: {
        name,
        deletedAt: null, // Exclude soft-deleted items
      },
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Update the amount
    await itemModel.update({ amount: item.amount + amountToAdd }, { where: { id: item.id } });

    // Create history record
    await historyModel.create({
      name: item.name,
      changeType: "",
      category: "Item",
      username: req.name,
      description,
      prevStock: item.amount,
      usedStock: amountToAdd,
      afterStock: item.amount + amountToAdd,
    });

    // Log the update action in the audit logs
    await logAuditEvent("Item", item.id, "update", {
      name: item.name,
      prevAmount: item.amount,
      newAmount: item.amount + amountToAdd,
      description,
    });

    res.status(200).json({ message: "Item amount updated", data: { name, newAmount: item.amount + amountToAdd } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
