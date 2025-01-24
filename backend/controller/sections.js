// import { historyModel, sectionModel, userModel } from "../models/index.js";

// export const getAllSection = async (req, res) => {
//   let response;
//   try {
//     response = await sectionModel.findAll({
//       attributes: ["uuid", "section_name", "section_number"],
//       include: [
//         {
//           model: userModel,
//           attributes: ["uuid", "name", "role"],
//         },
//       ],
//     });

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getSectionById = async (req, res) => {
//   try {
//     const response = await sectionModel.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//       attributes: ["uuid", "section_name", "section_number"],
//       include: [
//         {
//           model: userModel,
//           attributes: ["uuid", "name", "role"],
//         },
//       ],
//     });
//     if (response === null) return res.status(404).json({ message: "section not found" });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createSection = async (req, res) => {
//   const { section_name, section_number } = req.body;
//   const section = await sectionModel.findOne({
//     where: {
//       section_name,
//     },
//   });
//   if (section) return res.status(400).json({ message: "section already exist" });
//   try {
//     const response = await sectionModel.create({
//       section_name,
//       section_number,
//       userId: req.userId,
//     });
//     res.status(200).json({ message: "section created", response });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteSection = async (req, res) => {
//   try {
//     await sectionModel.destroy({ where: { uuid: req.params.id } });
//     await historyModel.create({
//       sectionId: req.params.id,
//       userId: req.userId,
//     });
//     res.status(200).json({ message: "section deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateSection = async (req, res) => {
//   try {
//     const section = await sectionModel.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     if (!section) return res.status(404).json({ message: "section not available" });
//     const { section_name, section_number } = req.body;
//     let response;
//     if (req.role === "admin") {
//       response = await sectionModel.update(
//         { section_name, section_number },
//         {
//           where: {
//             id: section.id,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== section.userId) return res.status(403).json({ message: "You are not allowed to update this section" });
//       response = await sectionModel.update(
//         { section_name, section_number },
//         {
//           where: {
//             [Op.and]: [{ id: section.id }, { userId: req.userId }],
//           },
//         }
//       );
//     }
//     res.status(200).json({ message: "Section updated" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import { Op } from "sequelize";
import { historyModel, sectionModel, machineModel, itemModel, userModel, AuditLogModel } from "../models/index.js"; // Adjust the paths as necessary

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

// Mendapatkan semua section
export const getAllSections = async (req, res) => {
  try {
    const response = await sectionModel.findAll({
      attributes: ["uuid", "section_name", "section_number"],
      where: {
        deletedAt: null, // Exclude soft-deleted sections
      },
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan section berdasarkan ID
export const getSectionById = async (req, res) => {
  try {
    const response = await sectionModel.findOne({
      where: {
        uuid: req.params.id,
        deletedAt: null, // Exclude soft-deleted sections
      },
      attributes: ["uuid", "section_name", "section_number"],
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
      ],
    });
    if (!response) return res.status(404).json({ message: "Section not found" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui section
export const updateSection = async (req, res) => {
  try {
    const section = await sectionModel.findOne({
      where: {
        uuid: req.params.id,
        deletedAt: null, // Exclude soft-deleted sections
      },
    });
    if (!section) return res.status(404).json({ message: "Section not available" });

    const { section_name, section_number } = req.body;
    let response;
    if (req.role === "admin") {
      response = await sectionModel.update(
        { section_name, section_number },
        {
          where: {
            id: section.id,
          },
        }
      );
    } else {
      if (req.userId !== section.userId) return res.status(403).json({ message: "You are not allowed to update this section" });
      response = await sectionModel.update(
        { section_name, section_number },
        {
          where: {
            [Op.and]: [{ id: section.id }, { userId: req.userId }],
          },
        }
      );
    }

    // Log the update action in the audit logs
    await logAuditEvent("Section", section.id, "update", {
      section_name,
      section_number,
    });

    // Create history record
    await historyModel.create({
      name: section.section_name,
      changeType: "Update",
      userId: req.userId,
      category: "Section Room",
      description: "Section updated",
    });

    res.status(200).json({ message: "Section updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//buat section
export const addSection = async (req, res) => {
  const { section_name, section_number } = req.body;

  const section = await sectionModel.findOne({
    where: {
      section_name,
    },
  });
  if (section) return res.status(400).json({ message: "Section Room already exists" });

  try {
    let newSection = await sectionModel.create({
      section_name,
      section_number,
      userId: req.userId, // userId is obtained from the middleware
    });

    // Log the create action in the audit logs
    await logAuditEvent("Section", newSection.id, "create", {
      section_name: newSection.section_name,
      section_number: newSection.section_number,
    });

    // Create history record
    await historyModel.create({
      name: newSection.section_name,
      changeType: "Create",
      category: "Section Room",
      username: req.name, // Use req.name for the username field
      description: "Section room created",
    });

    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//hapus section
export const deleteSection = async (req, res) => {
  try {
    const section = await sectionModel.findOne({ where: { uuid: req.params.id, deletedAt: null } });
    if (!section) return res.status(404).json({ message: "Section not found" });

    // Soft delete the section
    await sectionModel.update(
      { deletedAt: new Date() }, // Perform soft delete
      { where: { uuid: req.params.id } }
    );

    // Soft delete related machines and items
    const machines = await machineModel.findAll({ where: { sectionId: section.id } });
    for (const machine of machines) {
      await machineModel.update({ deletedAt: new Date() }, { where: { id: machine.id } });

      // Soft delete related items for each machine
      await itemModel.update({ deletedAt: new Date() }, { where: { machineId: machine.id } });
    }

    // Create history record
    await historyModel.create({
      name: section.section_name,
      changeType: "Delete",
      username: req.name,
      category: "Section Room",
      description: "Section deleted",
    });

    // Log the delete action in the audit logs
    await logAuditEvent("Section", section.id, "delete", { section_name: section.section_name });

    res.status(200).json({ message: "Section and related entities deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
