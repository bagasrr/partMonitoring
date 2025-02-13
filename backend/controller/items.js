import { historyModel, itemModel, machineModel, sectionModel, userModel, AuditLogModel, itemUseHistoryModel, vendorModel, itemHistoryModel } from "../models/index.js";
import { Op, where } from "sequelize";
import { sendBrokenPartEmail, sendEmailWithPDF, sendLowerLimitEmail } from "../services/sendEmail.js";
import { createPDFWithTable } from "../services/pdfCreate.js";
import { getUserAdminEmail } from "./users.js";
import { addItemHistories } from "./itemHistories.js";
import { generateHTMLBrokenReport, generateHTMLLowerLimitReport } from "../services/reportGenerator.js";

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
const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const getAllItems = async (req, res) => {
  try {
    const response = await itemModel.findAll({
      attributes: ["uuid", "name", "item_number", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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
        {
          model: vendorModel,
          attributes: ["uuid", "vendor_name"],
        },
        {
          model: itemHistoryModel,
          attributes: ["uuid", "activities", "createdAt"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemType = async (req, res) => {
  const { type } = req.params;
  try {
    const items = await itemModel.findAll({
      where: {
        replacementType: type,
        deletedAt: null, // Exclude soft-deleted items
      },
      attributes: ["uuid", "name", "item_number", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name"],
        },
        {
          model: machineModel,
          attributes: ["uuid", "machine_name", "machine_number"],
        },
        {
          model: vendorModel,
          attributes: ["uuid", "vendor_name"],
        },
        {
          model: itemHistoryModel,
          attributes: ["uuid", "activities", "createdAt"],
          include: [
            {
              model: userModel,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [
        ["updatedAt", "DESC"],
        [itemHistoryModel, "createdAt", "DESC"],
      ],
    });
    res.status(200).json(items);
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
      attributes: ["uuid", "name", "item_number", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
        {
          model: machineModel,
          attributes: ["uuid", "machine_name", "machine_number"],
        },
        {
          model: vendorModel,
          attributes: ["uuid", "vendor_name"],
        },
        {
          model: itemHistoryModel,
          attributes: ["uuid", "activities", "createdAt"],
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
      attributes: ["uuid", "name", "item_number", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
      include: [
        {
          model: machineModel,
          attributes: ["uuid", "machine_name"],
        },
        {
          model: vendorModel,
          attributes: ["uuid", "vendor_name"],
        },
        {
          model: itemHistoryModel,
          attributes: ["uuid", "activities", "createdAt"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: userModel,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
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
      attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
      include: [
        {
          model: machineModel,
          attributes: ["uuid", "machine_name"],
        },
        {
          model: vendorModel,
          attributes: ["uuid", "vendor_name"],
        },
        {
          model: itemHistoryModel,
          attributes: ["uuid", "activities", "createdAt"],

          include: [
            {
              model: userModel,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [
        ["updatedAt", "DESC"],
        [itemHistoryModel, "createdAt", "DESC"],
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
      attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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

export const createItem = async (req, res) => {
  const { name, amount, description, status, lowerLimit, machine_name, machine_number, section_name, section_number, replacementType, year, item_number, vendor_name } = req.body;

  try {
    if (typeof amount !== "number" || typeof lowerLimit !== "number") {
      return res.status(400).json({ message: "Invalid data type" });
    }
    // Validate that amount is greater than 0
    if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

    let machine = await machineModel.findOne({ where: { machine_name } });

    if (replacementType === "Replace") {
      const item = await itemModel.findOne({ where: { name, deletedAt: null, machineId: machine.id } });
      if (item) return res.status(400).json({ message: `PartName '${name}' in machine ${machine_name} Already Exist, Please use different Name or select Add Amount` });
    } else {
      const item = await itemModel.findOne({ where: { item_number } });
      if (item) return res.status(400).json({ message: `PartNumber ${item_number} Already Exist, Please use different Number` });
    }

    // Find or create machine

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

    const vendor = await vendorModel.findOne({ where: { vendor_name } });
    if (!vendor && vendor_name !== null) {
      await vendorModel.create({
        vendor_name,
        userId: req.userId,
      });
      await historyModel.create({
        name: vendor_name,
        changeType: "Create",
        category: "Vendor",
        username: req.name,
        description: "Vendor created during part creation",
      });
      await logAuditEvent("Vendor", vendor.id, "create", { vendor_name: vendor.vendor_name });
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
      item_number,
      vendorId: vendor?.id || null,
    });

    await addItemHistories(newItem.id, req.userId, "Part Added");

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
      status === "Broken" ? await addItemHistories(item.id, req.userId, "Part Broken") : await addItemHistories(item.id, req.userId, "Part Updated");
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to update this item" });
      await itemModel.update(
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
      await addItemHistories(item.id, req.userId, "Part Updated");
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
    // const title = "Part Broken Report";
    // const headers = ["Date", "Part Name", "Status", "Amount", "Reason", "Machine Name", "Changed By"];
    // const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    // const rows = [[currentDate, item.name, status, item.amount, `Status changed to ${status}.`, item.machine.machine_name, req.name]];

    // const fileName = `Parts ${item.name} Broken Report ${currentDate.replace(/[\s,:]/g, "-")}.pdf`;

    const adminEmails = await getUserAdminEmail();
    const htmlContent = generateHTMLBrokenReport(item, status, currentDate, "Status Changed", req.name);
    // Membuat PDF
    // createPDFWithTable(title, headers, rows, async (pdfBuffer) => {
    //   if (status === "Broken") {
    //     try {
    //       await sendEmailWithPDF(adminEmails, `${item.name} is Broken`, `Part ${item.name} is now ${status}.`, fileName, pdfBuffer);
    //     } catch (error) {
    //       console.log(`Email failed to send: ${error}`);
    //       return res.status(500).json({ message: "Email failed to send." });
    //     }
    //   }
    // });

    if (status === "Broken") {
      try {
        await sendBrokenPartEmail(adminEmails, `${item.name} (${item.item_number})- ${item.machine.machine_name} is now ${status}`, htmlContent);
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

    status === "Broken" ? await addItemHistories(item.id, req.userId, "Part Broken") : await addItemHistories(item.id, req.userId, `Status Changed`);
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
    // const title = "Part Broken Report";
    // const headers = ["Date", "Part Name", "Status", "Amount", "Reason", "Machine Name", "Changed By"];
    // const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    // const rows = [[currentDate, item.name, status, item.amount, reason, item.machine.machine_name, req.name]];

    // const fileName = `Parts ${item.name} Broken Report ${currentDate.replace(/[\s,:]/g, "-")}.pdf`;

    // Membuat PDF
    // createPDFWithTable(title, headers, rows, async (pdfBuffer) => {
    //   if (status === "Broken") {
    //     try {
    //       await sendEmailWithPDF(adminEmails, `${item.name} is Broken`, `Part ${item.name} is now ${status}.`, fileName, pdfBuffer);
    //     } catch (error) {
    //       console.log(`Email failed to send: ${error}`);
    //       return res.status(500).json({ message: "Email failed to send." });
    //     }
    //   }
    // });
    const adminEmails = await getUserAdminEmail();
    const htmlContent = generateHTMLBrokenReport(item, status, currentDate, reason, req.name);

    if (status === "Broken") {
      try {
        await sendBrokenPartEmail(adminEmails, `${item.name} (${item.item_number})- ${item.machine.machine_name} is now ${status}`, htmlContent);
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

    status === "Broken" ? await addItemHistories(item.id, req.userId, "Part Broken") : status === "Terminated" ? await addItemHistories(item.id, req.userId, "Terminated") : await addItemHistories(item.id, req.userId, "Status Changed");

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
      },
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (req.role === "admin") {
      await itemModel.update(
        { deletedAt: new Date() }, // Perform soft delete
        { where: { id: item.id } }
      );
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to delete this, please contact your administrator" });
      await itemModel.update(
        { deletedAt: new Date() }, // Perform soft delete
        { where: { [Op.and]: [{ id: item.id }, { userId: req.userId }] } }
      );
    }

    await addItemHistories(item.id, req.userId, "Part Deleted");
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

    await addItemHistories(item.id, req.userId, "Amount Added");
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
      return res.status(400).json({ message: "Name, Year, and Reason are required" });
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

    if (replaceItemName === null) {
      //membuat data tabel pdf
      const title = "Part Broken Report";
      const headers = ["Date", "Part Name", "Status", "Amount", "Reason", "Machine Name", "Changed By"];
      const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      const rows = [[currentDate, item.name, itemStatus, item.amount, reason, item.machine.machine_name, req.name]];
      const fileName = `Parts ${item.name} Broken Report ${currentDate.replace(/[\s,:]/g, "-")}.pdf`;

      const adminEmails = await getUserAdminEmail();

      const htmlContent = generateHTMLBrokenReport(item, itemStatus, currentDate, reason, req.name);

      // Kirim email
      if (itemStatus === "Broken") {
        try {
          await sendBrokenPartEmail(adminEmails, `${item.name} is Broken`, htmlContent);
        } catch (error) {
          console.log(`Email failed to send: ${error}`);
          return res.status(500).json({ message: error.message });
        }
      }

      // Membuat PDF
      // createPDFWithTable(title, headers, rows, async (pdfBuffer) => {
      //   if (itemStatus === "Broken") {
      //     try {
      //       await sendEmailWithPDF(adminEmails, `${item.name} is Broken`, `Part ${item.name} is now ${itemStatus}.`, fileName, pdfBuffer);
      //       await addItemHistories(item.id, req.userId, "Part Broken");
      //     } catch (error) {
      //       console.log(`Email failed to send: ${error}`);
      //       return res.status(500).json({ message: "Email failed to send." });
      //     }
      //   }
      // });

      const itemUseHistories = await itemUseHistoryModel.findAll({
        where: { itemId: item.id },
      });
      const totalUseCount = itemUseHistories.length;
      const dayUsed = Math.ceil((new Date(itemEndUseDate) - new Date(itemStartUseDate)) / (1000 * 60 * 60 * 24)); // Calculate the difference in days

      await itemUseHistoryModel.create({
        itemId: item.id,
        replacementItemId: null,
        itemStartUseDate: itemStartUseDate,
        itemEndUseDate: itemEndUseDate,
        useAmount: totalUseCount + 1,
        reason,
        dayUsed,
      });
      const totalDayUsed = item.dayUsed + dayUsed;

      // Update item status
      await itemModel.update({ status: itemStatus, dayUsed: totalDayUsed, replacementDate: currentDate }, { where: { id: item.id } });
      //update item replacement status

      await addItemHistories(item.id, req.userId, "Part Swapped");
      //history
      await historyModel.create({
        name: item.name,
        changeType: "Swap",
        category: "Part",
        username: req.name, // Use req.name for the username field
        description: reason,
      });

      res.status(200).json({ message: "Item replaced successfully" });
    } else {
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

      // const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      //membuat data tabel pdf
      // const title = "Part Broken Report";
      // const headers = ["Date", "Part Name", "Status", "Amount", "Reason", "Machine Name", "Changed By"];
      // const rows = [[currentDate, item.name, itemStatus, item.amount, reason, item.machine.machine_name, req.name]];
      // const fileName = `Parts ${item.name} Broken Report ${currentDate.replace(/[\s,:]/g, "-")}.pdf`;

      const adminEmails = await getUserAdminEmail();

      const htmlContent = generateHTMLBrokenReport(item, itemStatus, currentDate, reason, req.name);

      // Kirim email
      if (itemStatus === "Broken") {
        try {
          await sendBrokenPartEmail(adminEmails, `${item.name} is Broken`, htmlContent);
        } catch (error) {
          console.log(`Email failed to send: ${error}`);
          return res.status(500).json({ message: error.message });
        }
      }

      // Membuat PDF
      // createPDFWithTable(title, headers, rows, async (pdfBuffer) => {
      //   if (itemStatus === "Broken") {
      //     try {
      //       await sendEmailWithPDF(adminEmails, `${item.name} is Broken`, `Part ${item.name} is now ${itemStatus}.`, fileName, pdfBuffer);
      //       await addItemHistories(item.id, req.userId, "Part Broken");
      //     } catch (error) {
      //       console.log(`Email failed to send: ${error}`);
      //       return res.status(500).json({ message: "Email failed to send." });
      //     }
      //   }
      // });

      const itemUseHistories = await itemUseHistoryModel.findAll({
        where: { itemId: item.id },
      });
      const totalUseCount = itemUseHistories.length;
      const dayUsed = Math.ceil((new Date(itemEndUseDate) - new Date(itemStartUseDate)) / (1000 * 60 * 60 * 24)); // Calculate the difference in days

      await itemUseHistoryModel.create({
        itemId: item.id,
        replacementItemId: replacementItem.id || null,
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
      await addItemHistories(item.id, req.userId, "Part Swapped");
      //history
      await historyModel.create({
        name: item.name,
        changeType: "Swap",
        category: "Part",
        username: req.name, // Use req.name for the username field
        description: `Swap item ${item.name} with ${replacementItem.name}`,
      });

      res.status(200).json({ message: "Item replaced successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replaceItem = async (req, res) => {
  const { itemName, reason, useAmount, machine_name } = req.body;
  try {
    const machine = await machineModel.findOne({
      where: { machine_name, deletedAt: null },
    });
    const item = await itemModel.findOne({
      where: { name: itemName, machineId: machine.id, deletedAt: null },
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

    const adminEmails = await getUserAdminEmail();

    if (newAmount <= item.lowerLimit) {
      try {
        const subject = `${item.name + " (" + item.machine.machine_name + ") is Low Stock"}`;
        const htmlContent = generateHTMLLowerLimitReport(item, newAmount);

        const info = await sendLowerLimitEmail(adminEmails, subject, htmlContent);
        console.log(`Email sent: ${info.response}`);
        // const subject = `${item.name + " ( " + item.machine.machine_name + " ) "} is Low Stock`;
        // const text = `Part ${item.name} is now hit the Lower limit.\nDetail: \nPart Name : ${item.name} \nPart Year : ${item.year} \nMachine Name : ${item.machine.machine_name} \nCurrent Amount: ${newAmount} \nLower Limit: ${item.lowerLimit}`;

        // // Memanggil fungsi sendLowerLimitEmail
        // const info = await sendLowerLimitEmail(adminEmails, subject, text);
        // console.log(`Email sent: ${info.response}`);
      } catch (error) {
        console.error(`Error sending email: ${error}`);
        return res.status(500).json({ message: "Gagal mengirim email" });
      }
    }

    await addItemHistories(item.id, req.userId, "Part Replaced");
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
    const items = await itemModel.findAll({
      where: { status: "In Use", deletedAt: null },
      attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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

export const getSpareItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({
      where: { status: "Spare", deletedAt: null },
      attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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

export const getBrokenItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({
      where: { status: "Broken", deletedAt: null },
      attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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

export const getRepairItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({
      where: { status: "Repair", deletedAt: null },
      attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
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
