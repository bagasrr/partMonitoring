import { historyModel, itemModel, machineModel, sectionModel, userModel, AuditLogModel, itemUseHistoryModel } from "../models/index.js";
import { Op, where } from "sequelize";
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
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType"],
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
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType"],
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

// Get items based on machine ID
export const getItemsByMachineId = async (req, res) => {
  const { machine_id } = req.query;

  try {
    const items = await itemModel.findAll({
      where: { machineId: machine_id },
    });

    if (!items.length) {
      return res.status(404).json({ message: "No items found for this machine" });
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  const { name, amount, description, status, lowerLimit, machine_name, machine_number, section_name, section_number, replacementType, year } = req.body;

  try {
    if (typeof amount !== "number" || typeof lowerLimit !== "number" || typeof year !== "number") {
      return res.status(400).json({ message: "Invalid data type" });
    }
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
      where: { name, machineId: machine.id, year },
    });

    if (prevItem) {
      await itemModel.update({ amount: prevItem.amount + amount }, { where: { id: prevItem.id } });

      // Create history record
      await historyModel.create({
        name,
        changeType: "Increase Item Amount",
        category: "Part",
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
        replacementType,
        year,
      });

      // Create history record for new item creation
      await historyModel.create({
        name,
        changeType: "Create New",
        category: "Part",
        username: req.name,
        description,
        newStock: amount,
        afterStock: amount,
      });

      // Log the create action in the audit logs
      await logAuditEvent("Part", newItem.id, "create", {
        name: newItem.name,
        amount: newItem.amount,
        description,
        status,
        lowerLimit,
      });

      // Check stock levels
      await checkStockLevels();

      return res.status(201).json({ message: "Part created", data: newItem });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await itemModel.findOne({
      where: {
        uuid: req.params.id,
        deletedAt: null,
      },
    });
    if (!item) return res.status(404).json({ message: "Part not found" });

    const { name, amount, description, status, lowerLimit, machine_name, machine_number, replacementType, year } = req.body;

    // Find or create the new machine
    let machine = await machineModel.findOne({ where: { machine_name } });

    if (!machine) {
      // Create new machine if it doesn't exist
      machine = await machineModel.create({
        machine_name,
        machine_number,
        sectionId: item.sectionId, // Assuming the section remains the same
        userId: req.userId,
      });

      // Create history record for machine creation
      await historyModel.create({
        name: machine.machine_name,
        changeType: "Create Machine",
        category: "Machine",
        username: req.name,
        description: "Machine created during item update",
      });

      // Log the machine creation in audit logs
      await logAuditEvent("Machine", machine.id, "create", {
        machine_name: machine.machine_name,
        machine_number: machine.machine_number,
      });
    }

    // Update item fields
    if (req.role === "admin") {
      await itemModel.update(
        {
          name,
          amount,
          description,
          status,
          year,
          replacementType,
          lowerLimit,
          machineId: machine.id,
        },
        { where: { id: item.id } }
      );
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to update this item" });
      response = await itemModel.update(
        {
          name,
          amount,
          description,
          status,
          lowerLimit,

          machineId: machine.id,
        },
        { where: { [Op.and]: [{ id: item.id }, { userId: req.userId }] } }
      );
    }

    // Log the update action in the audit logs
    await logAuditEvent("Item", item.id, "update", {
      name,
      amount,
      description,
      status,
      lowerLimit,
      year,
      replacementType,
      machineId: machine.id,
    });

    // Create history record
    await historyModel.create({
      name,
      changeType: "Update Part",
      category: "Part",
      username: req.name,
      description,
      prevStock: item.amount,
      afterStock: amount,
    });

    // Check stock levels
    await checkStockLevels();

    res.status(200).json({ message: "Part updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const item = await itemModel.findOne({ where: { uuid: req.params.id, deletedAt: null } });

    if (!item) return res.status(404).json({ message: "Part not found" });
    const prevStatus = item.status; // Update the item status

    await itemModel.update({ status }, { where: { uuid: req.params.id } }); // Create history record

    await historyModel.create({
      name: item.name,
      changeType: "Update Status",
      category: "Part",
      username: req.name,
      description: `Status changed from ${prevStatus} to ${status}`,
    }); // Log the update action in the audit logs
    await logAuditEvent("Item", item.id, "update", { name: item.name, prevStatus: prevStatus, newStatus: status });
    res.status(200).json({ message: "Part status updated" });
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
      changeType: "Delete Part",
      category: "Part",
      username: req.name,
      description: "Part deleted",
    });

    // Log the delete action in the audit logs
    await logAuditEvent("Item", item.id, "delete", { name: item.name, amount: item.amount });

    res.status(200).json({ message: "Part deleted" });
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
      changeType: "Add Amount",
      category: "Part",
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

    res.status(200).json({ message: "Part amount updated", data: { name, newAmount: item.amount + amountToAdd } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeItem = async (req, res) => {
  const { itemName, replaceItemName, itemStartUseDate, itemEndUseDate, machineName, reason, itemYear, replaceItemYear, itemStatus, useAmount } = req.body;

  // Validate required fields
  if (!itemName || !itemYear || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the item by name
    const item = await itemModel.findOne({
      where: {
        name: itemName,
        year: itemYear,
        deletedAt: null, // Exclude soft-deleted items
      },
    });
    if (!item) return res.status(404).json({ message: `part not found` });

    // Check if amount is enough
    if (item.amount < useAmount) {
      return res.status(400).json({ message: `Amount not enough` });
    }
    let newAmount = item.amount - useAmount;

    // Update the amount uf the item is a replacement
    if (item.replacementType === "Replace") {
      await itemModel.update({ amount: newAmount }, { where: { id: item.id } });

      // Create history record
      await historyModel.create({
        name: item.name,
        changeType: "Change Part",
        category: "Part",
        username: req.name,
        prevStock: item.amount,
        usedStock: useAmount,
        afterStock: newAmount,
        description: `Replace ${useAmount} ea ${itemName}`,
      });

      // Log the update action in the audit logs
      await logAuditEvent("part", item.id, "update", {
        name: item.name,
        prevAmount: item.amount,
        newAmount: item.amount - useAmount,
        description: `Replace ${useAmount} ea ${itemName}`,
      });
    }
    //if item is swap
    else {
      if (replaceItemName === "NA") {
        if (itemStatus == "Broken") {
          await itemModel.update({ status: "Broken" }, { where: { id: item.id } });
          //masukin email otomatis ke user
        } else {
          await itemModel.update({
            status: itemStatus,
          });
        }

        itemUseHistoryModel.create({
          itemId: item.id,
          replacementItemId: null,
          machineId: null,
          itemStartUseDate,
          itemEndUseDate,
          useCount: 1,
          reason,
        });

        // Create history record
        await historyModel.create({
          name: item.name,
          changeType: "Change Part",
          category: "Swap",
          username: req.name,
          description: `${itemName} - ${item.year} changed to ${replaceItemName} - ${replacementItem.year} With reason : ${reason}`,
        });

        // Log the update action in the audit logs
        await logAuditEvent("Item", item.id, "update", {
          name: item.name,
          prevStatus: item.status,
          newStatus: "Broken",
          description: `${itemName} - ${item.year} changed to ${replaceItemName} - ${replacementItem.year} With reason : ${reason}`,
        });
      } else {
        // Find the replacement item
        const replacementItem = await itemModel.findOne({
          where: {
            name: replaceItemName,
            year: replaceItemYear,
            deletedAt: null, // Exclude soft-deleted items
          },
        });

        if (!replacementItem) return res.status(404).json({ message: "Replacement item not found" });

        const machine = await machineModel.findOne({
          where: {
            machine_name: machineName,
            deletedAt: null, // Exclude soft-deleted items
          },
        });
        if (!machine) return res.status(404).json({ message: "Machine not found" });

        const itemUseHistory = await itemUseHistoryModel.findOne({
          where: {
            itemId: item.id,
          },
        });

        await itemUseHistoryModel.create({
          itemId: item.id,
          replacementItemId: replacementItem.id,
          machineId: machine.id,
          itemStartUseDate,
          itemEndUseDate,
          useCount: 1 || itemUseHistory.useCount + 1,
          reason,
        });

        //ganti status Replace item
        await itemModel.update({ status: "In Use" }, { where: { id: replacementItem.id } });

        // ganti status item
        if (itemStatus === "Broken") {
          await itemModel.update({ status: "Broken" }, { where: { id: item.id } });
          res.status(200).json({ message: "Part Update With Status : Broken" });
          //masukin email otomatis ke user
        } else {
          await itemModel.update({ status: itemStatus }, { where: { id: item.id } });
        }

        // Create history record
        await historyModel.create({
          name: item.name,
          changeType: "Change Part",
          category: "Part",
          username: req.name,
          description: ` ${itemName} - ${item.year} changed to ${replaceItemName} - ${replacementItem.year} With reason : ${reason}`,
        });

        // Log the update action in the audit logs
        await logAuditEvent("Item", item.id, "update", {
          name: item.name,
          prevStatus: item.status,
          newStatus: "In Use",
          description: `${itemName} changed to ${replaceItemName} With reason : ${reason}`,
        });
      }
    }
    res.status(200).json({ message: "Part updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
