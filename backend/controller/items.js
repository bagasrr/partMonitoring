import { historyModel, itemModel, machineModel, sectionModel, userModel, AuditLogModel, itemUseHistoryModel } from "../models/index.js";
import { Op, where } from "sequelize";
import { checkStockLevels } from "../services/mailsent.js"; // Import stock alert utility
import { sendEmailWithPDF, sendLowerLimitEmail } from "../services/sendEmail.js";
import { createPDFWithTable } from "../services/pdfCreate.js";

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
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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
    if (!item) return res.status(404).json({ message: "Item1 not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReplaceItem = async (req, res) => {
  try {
    const items = await itemModel.findAll({
      where: { replacementType: "Replace" },
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSwapItem = async (req, res) => {
  try {
    const items = await itemModel.findAll({
      where: { replacementType: "Swap" },
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
      include: [
        {
          model: machineModel,
          attributes: ["uuid", "machine_name"],
        },
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSwapReplaceItem = async (req, res) => {
  const { machineName } = req.query;

  try {
    const machine = await machineModel.findOne({ where: { machine_name: machineName } });
    if (!machine) return res.status(404).json({ message: "Machine Not found" });

    const items = await itemModel.findAll({
      where: {
        replacementType: "Swap",
        status: { [Op.ne]: "In Use" }, // Menggunakan Op.ne untuk status yang bukan "In Use"
        machineId: machine.id,
      },
      attributes: ["uuid", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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

    const item = await itemModel.findOne({ where: { name } });
    if (item) return res.status(400).json({ message: "PartName Already Exist, Please use different Name" });

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
          changeType: "Create",
          category: "Section Room",
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
        changeType: "Create",
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
      changeType: "Create",
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

    return res.status(201).json({ message: "Part created", data: newItem });
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
        changeType: "Create",
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
      changeType: "Update",
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

    const item = await itemModel.findOne({
      where: { uuid: req.params.id, deletedAt: null },
      include: [{ model: machineModel, attributes: ["machine_name"] }],
    });

    if (!item) return res.status(404).json({ message: "Part not found" });
    const prevStatus = item.status; // Update the item status

    // Membuat deskripsi item dan data tabel
    const title = "Parts Broken Report";
    const headers = ["Date", "Part Name", "Status", "Amount", "Reason", "Machine Name", "Changed By"];
    const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const rows = [[currentDate, item.name, status, item.amount, `Status changed to ${status}.`, item.machine.machine_name, req.name]];

    const fileName = `Parts ${item.name} Broken Report ${currentDate.replace(/[\s,:]/g, "-")}.pdf`;

    // Membuat PDF
    createPDFWithTable(title, headers, rows, async (pdfBuffer) => {
      if (status === "Broken") {
        try {
          await sendEmailWithPDF("kuliah.bagass@gmail.com", `${item.name} is Broken`, `Part ${item.name} is now ${status}.`, fileName, pdfBuffer);
        } catch (error) {
          console.log(`Email failed to send: ${error}`);
          return res.status(500).json({ message: "Email failed to send." });
        }
      }

      await itemModel.update(
        { status },
        {
          where: { id: item.id },
        }
      );

      // Buat catatan riwayat
      await historyModel.create({
        name: item.name,
        changeType: "Update",
        category: "Part",
        username: req.name,
        description: `Status changed from ${prevStatus} to ${status}`,
      });

      // Log the update action in the audit logs
      await logAuditEvent("Item", item.id, "update", { name: item.name, prevStatus: prevStatus, newStatus: status });

      res.status(200).json({ message: "Part status updated" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItemStatusForm = async (req, res) => {
  const { itemName, status, itemYear, reason } = req.body;
  try {
    if (!itemName || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const item = await itemModel.findOne({
      where: { name: itemName, year: itemYear, deletedAt: null },
      include: [
        {
          model: machineModel,
          attributes: ["uuid", "machine_name", "machine_number"],
        },
      ],
    });
    if (!item) return res.status(404).json({ message: "Item not found" });

    const prevStatus = item.status;

    if (prevStatus === status) {
      return res.status(400).json({ message: `Cannot change status to '${status}' again` });
    }

    // Membuat deskripsi item dan data tabel
    const title = "Parts Broken Report";
    const headers = ["Date", "Part Name", "Status", "Amount", "Reason", "Machine Name", "Changed By"];
    const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const rows = [[currentDate, item.name, status, item.amount, reason, item.machine.machine_name, req.name]];

    const fileName = `Parts ${item.name} Broken Report ${currentDate.replace(/[\s,:]/g, "-")}.pdf`;

    // Membuat PDF
    createPDFWithTable(title, headers, rows, async (pdfBuffer) => {
      if (status === "Broken") {
        try {
          await sendEmailWithPDF("kuliah.bagass@gmail.com", `${item.name} is Broken`, `Part ${item.name} is now ${status}.`, fileName, pdfBuffer);
        } catch (error) {
          console.log(`Email failed to send: ${error}`);
          return res.status(500).json({ message: "Email failed to send." });
        }
      }

      await itemModel.update(
        { status },
        {
          where: { name: itemName, year: itemYear },
        }
      );

      // Buat catatan riwayat
      await historyModel.create({
        name: item.name,
        changeType: "Update",
        category: "Part",
        username: req.name,
        description: reason,
      });

      // Log the update action in the audit logs
      await logAuditEvent("Item", item.id, "update", { name: item.name, prevStatus: prevStatus, newStatus: status });

      res.status(200).json({ message: "Part status updated" });
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
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
      changeType: "Delete",
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
    if (typeof amountToAdd !== "number") {
      return res.status(400).json({ message: "Invalid data type" });
    }
    // Validate that amountToAdd is greater than 0
    if (amountToAdd <= 0) return res.status(400).json({ message: "Amount to add must be greater than 0" });

    // Find the item by name
    const item = await itemModel.findOne({
      where: {
        name,
        replacementType: "Replace",
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

export const swapItem = async (req, res) => {
  const { itemName, itemYear, replaceItemName, replaceItemYear, itemStartUseDate, itemEndUseDate, reason, itemStatus } = req.body;
  try {
    if (!itemName || !itemYear || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate to ensure itemEndUseDate is not before itemStartUseDate
    if (new Date(itemEndUseDate) < new Date(itemStartUseDate)) {
      return res.status(400).json({ message: "End use date cannot be earlier than start use date" });
    }

    //cari item berdasarkan nama, tahun
    const item = await itemModel.findOne({
      where: {
        name: itemName,
        year: itemYear,
        deletedAt: null, // Exclude soft-deleted items
      },
      include: [
        {
          model: machineModel,
          attributes: ["machine_name"],
        },
      ],
    });
    if (!item) return res.status(404).json({ message: "Item not found" });

    //cari replace item berdasarkan nama, tahun
    const replacementItem = await itemModel.findOne({
      where: {
        name: replaceItemName,
        year: replaceItemYear,
        deletedAt: null, // Exclude soft-deleted items
      },
    });
    if (!replacementItem) return res.status(404).json({ message: "Replacement part not found" });
    if (replacementItem.status === "Broken") return res.status(403).json({ message: "Replacement part is broken and can't be replaced" });
    if (replacementItem.status === "Repair") return res.status(403).json({ message: "Replacement part is under repair and can't be replaced" });

    //cek apakah mesinnya sama
    if (item.machineId !== replacementItem.machineId) return res.status(403).json({ message: "Parts must be in the same machine" });

    //membuat data tabel pdf
    const title = "Parts Broken Report";
    const headers = ["Date", "Part Name", "Status", "Amount", "Reason", "Machine Name", "Changed By"];
    const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const rows = [[currentDate, item.name, itemStatus, item.amount, reason, item.machine.machine_name, req.name]];
    const fileName = `Parts ${item.name} Broken Report ${currentDate.replace(/[\s,:]/g, "-")}.pdf`;
    // Membuat PDF
    createPDFWithTable(title, headers, rows, async (pdfBuffer) => {
      if (itemStatus === "Broken") {
        try {
          await sendEmailWithPDF("kuliah.bagass@gmail.com", `${item.name} is Broken`, `Part ${item.name} is now ${itemStatus}.`, fileName, pdfBuffer);
        } catch (error) {
          console.log(`Email failed to send: ${error}`);
          return res.status(500).json({ message: "Email failed to send." });
        }
      }
    });

    const itemUseHistories = await itemUseHistoryModel.findAll({
      where: { itemId: item.id },
    });
    const totalUseCount = itemUseHistories.length;
    const dayUsed = Math.ceil((new Date(itemEndUseDate) - new Date(itemStartUseDate)) / (1000 * 60 * 60 * 24)); // Calculate the difference in days

    await itemUseHistoryModel.create({
      itemId: item.id,
      replacementItemId: replacementItem.id,
      itemStartUseDate: itemStartUseDate,
      itemEndUseDate: itemEndUseDate,
      useAmount: totalUseCount + 1,
      reason,
      dayUsed,
    });
    const totalDayUsed = item.dayUsed + dayUsed;

    // Update item status
    await itemModel.update({ status: itemStatus, dayUsed: totalDayUsed }, { where: { id: item.id } });
    //update item replacement status
    await itemModel.update({ status: "In Use", replacementDate: itemEndUseDate }, { where: { id: replacementItem.id } });

    //history
    await historyModel.create({
      name: item.name,
      changeType: "Swap",
      category: "Part",
      username: req.name, // Use req.name for the username field
      description: `Swap item ${item.name} with ${replacementItem.name}`,
    });

    res.status(200).json({ message: "Item replaced successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replaceItem = async (req, res) => {
  const { itemName, itemYear, reason, useAmount } = req.body;
  try {
    const item = await itemModel.findOne({
      where: { name: itemName, year: itemYear, deletedAt: null },
      include: [
        {
          model: machineModel,
          attributes: ["uuid", "machine_name", "machine_number"],
        },
      ],
    });
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (useAmount > item.amount) return res.status(400).json({ message: "Your dont have enough amount" });

    const newAmount = item.amount - useAmount;
    await itemModel.update({ amount: newAmount }, { where: { id: item.id } });

    // Check stock levels
    // await checkStockLevels(item.uuid);
    if (newAmount <= item.lowerLimit) {
      await sendLowerLimitEmail(
        "kuliah.bagass@gmail.com",
        `${item.name + " ( " + item.machine.machine_name + " ) "} is Low Stock`,
        `Part ${item.name} is now hit the Lower limit.\nDetail: \nPart Name : ${item.name} \nPart Year : ${item.year} \nMachine Name : ${item.machine.machine_name} \nCurrent Amount: ${newAmount} \nLower Limit: ${item.lowerLimit}`
      );
    }

    // Create history record
    await historyModel.create({
      name: item.name,
      changeType: "Replace",
      category: "Part",
      username: req.name,
      description: reason,
    });
    await logAuditEvent("Item", item.id, "update", { name: item.name, prevAmount: item.amount, newAmount: newAmount });

    return res.status(200).json({ message: "Replace success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInUseItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({ where: { status: "In Use", deletedAt: null } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpareItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({ where: { status: "Spare", deletedAt: null } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBrokenItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({ where: { status: "Broken", deletedAt: null } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRepairItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({ where: { status: "Repair", deletedAt: null } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
