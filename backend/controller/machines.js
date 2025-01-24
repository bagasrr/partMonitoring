import { Op } from "sequelize";
import { historyModel, machineModel, sectionModel, itemModel, userModel, AuditLogModel } from "../models/index.js"; // Adjust the paths as necessary

// Function to log audit events
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

// Menambahkan mesin baru
export const addMachine = async (req, res) => {
  const { machine_name, machine_number, section_name, section_number } = req.body;

  const machine = await machineModel.findOne({
    where: {
      machine_name,
    },
  });
  if (machine) return res.status(400).json({ message: "Machine already exists" });

  try {
    let section = await sectionModel.findOne({ where: { section_name } });

    if (!section) {
      section = await sectionModel.create({
        section_name,
        section_number,
        userId: req.userId,
      });
    }

    // Buat mesin dengan sectionId dan userId
    const newMachine = await machineModel.create({
      machine_name,
      machine_number,
      sectionId: section.id,
      userId: req.userId,
    });

    // Log the create action in the audit logs
    await logAuditEvent("Machine", newMachine.id, "create", {
      machine_name: newMachine.machine_name,
      machine_number: newMachine.machine_number,
      section_name: section.section_name,
    });

    // Create history record
    await historyModel.create({
      name: newMachine.machine_name,
      changeType: "Create",
      username: req.name, // Use req.name for the username field
      description: "Machine created",
      category: "Machine",
    });

    res.status(201).json(newMachine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan semua mesin
export const getMachines = async (req, res) => {
  try {
    const response = await machineModel.findAll({
      attributes: ["uuid", "machine_name", "machine_number"],
      where: {
        deletedAt: null, // Exclude soft-deleted machines
      },
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
        {
          model: sectionModel,
          attributes: ["uuid", "section_name", "section_number"],
        },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan mesin berdasarkan ID
export const getMachineById = async (req, res) => {
  try {
    const machine = await machineModel.findOne({
      where: {
        uuid: req.params.id,
        deletedAt: null, // Exclude soft-deleted machines
      },
    });
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    let response;
    if (req.role === "admin") {
      response = await machineModel.findOne({
        where: {
          id: machine.id,
          deletedAt: null,
        },
        attributes: ["uuid", "machine_name", "machine_number"],
        include: [
          {
            model: userModel,
            attributes: ["uuid", "name", "role"],
          },
          {
            model: sectionModel,
            attributes: ["uuid", "section_name", "section_number"],
          },
        ],
      });
      res.status(200).json(response);
    } else {
      response = await machineModel.findOne({
        where: {
          [Op.and]: [{ id: machine.id }, { userId: req.userId }, { deletedAt: null }],
        },
        attributes: ["uuid", "machine_name", "machine_number"],
        include: [
          {
            model: userModel,
            attributes: ["uuid", "name", "role"],
          },
          {
            model: sectionModel,
            attributes: ["uuid", "section_name", "section_number"],
          },
        ],
      });
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui mesin
export const updateMachine = async (req, res) => {
  try {
    const machine = await machineModel.findOne({
      where: { uuid: req.params.id, deletedAt: null },
    });
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    const { machine_name, machine_number, section_name, section_number } = req.body;
    const userId = req.userId;
    let newSection;

    if (req.role === "admin") {
      await machineModel.update({ machine_name, machine_number }, { where: { id: machine.id } });

      let section = await sectionModel.findOne({ where: { section_name } });

      if (!section) {
        newSection = await sectionModel.create({ section_name, section_number, userId });
      } else {
        await sectionModel.update({ section_name, section_number }, { where: { id: section.id } });
        newSection = section;
      }

      machine.sectionId = newSection.id;
      await machine.save();

      // Log the update action in the audit logs
      await logAuditEvent("Machine", machine.id, "update", {
        machine_name,
        machine_number,
        section_name: newSection.section_name,
      });

      // Create history record
      await historyModel.create({
        name: machine.machine_name,
        changeType: "Update",
        category: "Machine",
        username: req.name, // Use req.name for the username field
        description: "Machine updated",
      });

      res.status(200).json({ message: "Update Success", machine });
    } else {
      if (userId !== machine.userId) {
        return res.status(403).json({ message: "You are not allowed to update this machine" });
      }

      await machineModel.update(
        { machine_name, machine_number },
        {
          where: {
            [Op.and]: [{ id: machine.id }, { userId: userId }],
          },
        }
      );

      let section = await sectionModel.findOne({ where: { section_name } });

      if (!section) {
        newSection = await sectionModel.create({ section_name, section_number, userId });
      } else {
        await sectionModel.update({ section_name, section_number }, { where: { id: section.id } });
        newSection = section;
      }

      machine.sectionId = newSection.id;
      await machine.save();

      // Log the update action in the audit logs
      await logAuditEvent("Machine", machine.id, "update", {
        machine_name,
        machine_number,
        section_name: newSection.section_name,
      });

      // Create history record
      await historyModel.create({
        name: machine.machine_name,
        changeType: "Update",
        category: "Machine",
        username: req.name, // Use req.name for the username field
        description: "Machine updated",
      });

      res.status(200).json({ message: "Update Success", machine });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus mesin
export const deleteMachine = async (req, res) => {
  try {
    const machine = await machineModel.findOne({ where: { uuid: req.params.id, deletedAt: null } });
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    await machineModel.update(
      { deletedAt: new Date() }, // Perform soft delete
      { where: { id: machine.id } }
    );

    // Soft delete related items for the machine
    await itemModel.update({ deletedAt: new Date() }, { where: { machineId: machine.id } });

    // Create history record
    await historyModel.create({
      name: machine.machine_name,
      changeType: "Delete",
      category: "Machine",
      username: req.name, // Use req.name for the username field
      description: "Machine deleted",
    });

    // Log the delete action in the audit logs
    await logAuditEvent("Machine", machine.id, "delete", { machine_name: machine.machine_name });

    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan semua mesin beserta item
export const getMachinesWithItems = async (req, res) => {
  try {
    const machines = await machineModel.findAll({
      where: {
        deletedAt: null, // Exclude soft-deleted machines
      },
      include: {
        model: itemModel,
        where: {
          deletedAt: null, // Exclude soft-deleted items
        },
      },
    });
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json;
  }
};
