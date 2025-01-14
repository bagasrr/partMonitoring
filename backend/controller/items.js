// import { historyModel, imagesModel, itemModel, machineModel, sectionModel, userModel } from "../models/index.js";
// import { Op } from "sequelize";
// import { addMachine } from "./machines.js";
// import { response } from "express";
// export const getAllItems = async (req, res) => {
//   try {
//     let response;

//     response = await itemModel.findAll({
//       attributes: ["uuid", "name", "stok"],
//       include: [
//         {
//           model: userModel,
//           attributes: ["uuid", "name", "role"],
//         },
//         {
//           model: machineModel,
//           attributes: ["uuid", "machine_name", "machine_number"],
//         },
//       ],
//     });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getItemById = async (req, res) => {
//   try {
//     const items = await itemModel.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     if (!items) return res.status(404).json({ message: "item not found" });
//     let response;
//     if (req.role === "admin") {
//       response = await itemModel.findOne({
//         attributes: ["uuid", "name", "stok"],
//         where: {
//           id: items.id,
//         },
//         include: [
//           {
//             model: userModel,
//             attributes: ["uuid", "name", "role"],
//           },
//           {
//             model: machineModel,
//             attributes: ["uuid", "machine_name", "machine_number"],
//           },
//         ],
//       });
//     } else {
//       response = await itemModel.findOne({
//         attributes: ["uuid", "name", "stok"],
//         where: {
//           [Op.and]: [{ id: items.id }, { userId: req.userId }],
//         },
//         include: [
//           {
//             model: userModel,
//             attributes: ["uuid", "name", "role"],
//           },
//           {
//             model: machineModel,
//             attributes: ["uuid", "machine_name", "machine_number"],
//           },
//         ],
//       });
//     }
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createItem = async (req, res) => {
//   const { name, stok, machine_name, machine_number, section_name, section_number, description } = req.body;

//   try {
//     // Cek stok harus lebih dari 0
//     if (stok <= 0) return res.status(400).json({ message: "Stok must be greater than 0" });

//     // Cari machine berdasarkan machine_name
//     let machine = await machineModel.findOne({
//       where: {
//         machine_name,
//       },
//     });

//     // Jika machine tidak ditemukan, buat machine baru
//     if (!machine) {
//       // Cari section berdasarkan section_name
//       let section = await sectionModel.findOne({ where: { section_name } });

//       // Jika section tidak ditemukan, buat section baru
//       if (!section) {
//         section = await sectionModel.create({
//           section_name,
//           section_number,
//           userId: req.userId,
//         });
//       }

//       // Buat machine baru dengan sectionId dan userId
//       machine = await machineModel.create({
//         machine_name,
//         machine_number,
//         sectionId: section.id,
//         userId: req.userId,
//       });
//     }

//     // Cari item sebelumnya berdasarkan name dan machineId
//     const prevData = await itemModel.findOne({
//       where: {
//         name,
//         machineId: machine.id,
//       },
//     });

//     // Jika prevData ditemukan, update stoknya
//     if (prevData) {
//       await itemModel.update({ stok: prevData.stok + stok }, { where: { id: prevData.id } });

//       // Buat histori baru untuk update stok
//       await historyModel.create({
//         itemId: prevData.id,
//         userId: req.userId,
//         machineId: prevData.machineId,
//         prevStock: prevData.stok,
//         usedStock: stok,
//         afterStock: prevData.stok + stok,
//         changeType: "Tambah Stok Part",
//         description,
//       });

//       return res.status(200).json({ message: "Item updated" });
//     } else {
//       // Jika prevData tidak ditemukan, buat item baru
//       const response = await itemModel.create({
//         name,
//         stok,
//         userId: req.userId,
//         machineId: machine.id,
//         description,
//       });

//       // Buat histori baru untuk item yang baru ditambahkan
//       await historyModel.create({
//         itemId: response.id,
//         userId: req.userId,
//         machineId: response.machineId,
//         prevStock: 0,
//         usedStock: stok,
//         afterStock: stok,
//         changeType: "Tambah Item Baru",
//         description,
//       });

//       return res.status(201).json({ message: "Item created", data: response });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const addStockItem = async (req, res) => {
//   try {
//     const item = await itemModel.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//   } catch (error) {}
// };
// export const updateItem = async (req, res) => {
//   try {
//     const item = await itemModel.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     if (!item) return res.status(404).json({ message: "item not found" });
//     const { name, stok } = req.body;
//     let response;
//     if (req.role === "admin") {
//       response = await itemModel.update(
//         { name, stok },
//         {
//           where: {
//             id: item.id,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to update this item" });
//       response = await itemModel.update(
//         { name, stok },
//         {
//           where: {
//             [Op.and]: [{ id: item.id }, { userId: req.userId }],
//           },
//         }
//       );
//     }
//     res.status(200).json({ message: "item updated" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteItem = async (req, res) => {
//   try {
//     const item = await itemModel.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     if (!item) return res.status(404).json({ message: "item not found" });
//     let response;
//     if (req.role === "admin") {
//       response = await itemModel.destroy({
//         where: {
//           id: item.id,
//         },
//       });
//     } else {
//       if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to delete this item" });
//       response = await itemModel.destroy({
//         where: {
//           [Op.and]: [{ id: item.id }, { userId: req.userId }],
//         },
//       });
//     }

//     await historyModel.create({
//       itemId: item.id,
//       userId: req.userId,
//       machineId: item.machineId,
//       prevStock: item.stok,
//       usedStock: item.stok,
//       afterStock: 0,
//       changeType: "DELETE",
//     });

//     res.status(200).json({ message: "item deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
    let response;

    response = await itemModel.findAll({
      attributes: ["uuid", "name", "stok"],
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
    const items = await itemModel.findOne({
      where: {
        uuid: req.params.id,
        deletedAt: null, // Exclude soft-deleted items
      },
    });
    if (!items) return res.status(404).json({ message: "item not found" });
    let response;
    if (req.role === "admin") {
      response = await itemModel.findOne({
        attributes: ["uuid", "name", "stok"],
        where: {
          id: items.id,
          deletedAt: null,
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
    } else {
      response = await itemModel.findOne({
        attributes: ["uuid", "name", "stok"],
        where: {
          [Op.and]: [{ id: items.id }, { userId: req.userId }, { deletedAt: null }],
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
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  const { name, stok, machine_name, machine_number, section_name, section_number, description, lowerLimit } = req.body;

  try {
    // Cek stok harus lebih dari 0
    if (stok <= 0) return res.status(400).json({ message: "Stok must be greater than 0" });

    // Cari machine berdasarkan machine_name
    let machine = await machineModel.findOne({
      where: {
        machine_name,
      },
    });

    // Jika machine tidak ditemukan, buat machine baru
    if (!machine) {
      // Cari section berdasarkan section_name
      let section = await sectionModel.findOne({ where: { section_name } });

      // Jika section tidak ditemukan, buat section baru
      if (!section) {
        section = await sectionModel.create({
          section_name,
          section_number,
          userId: req.userId,
        });
      }

      // Buat machine baru dengan sectionId dan userId
      machine = await machineModel.create({
        machine_name,
        machine_number,
        sectionId: section.id,
        userId: req.userId,
      });
    }

    // Cari item sebelumnya berdasarkan name dan machineId
    const prevData = await itemModel.findOne({
      where: {
        name,
        machineId: machine.id,
      },
    });

    // Jika prevData ditemukan, update stoknya
    if (prevData) {
      await itemModel.update({ stok: prevData.stok + stok }, { where: { id: prevData.id } });

      // Buat histori baru untuk update stok
      await historyModel.create({
        itemId: prevData.id,
        userId: req.userId,
        machineId: prevData.machineId,
        prevStock: prevData.stok,
        usedStock: stok,
        afterStock: prevData.stok + stok,
        itemName: name,
        machineName: machine.machine_name,
        sectionName: section.section_name,
        changeType: "Tambah Stok Part",
        description,
      });

      // Log the update action in the audit logs
      await logAuditEvent("Item", prevData.id, "update", {
        prevStock: prevData.stok,
        addedStock: stok,
        afterStock: prevData.stok + stok,
        description,
      });

      // Check stock levels
      await checkStockLevels();

      return res.status(200).json({ message: "Item updated" });
    } else {
      // Jika prevData tidak ditemukan, buat item baru
      const response = await itemModel.create({
        name,
        stok,
        userId: req.userId,
        machineId: machine.id,
        description,
        lowerLimit,
      });

      // Buat histori baru untuk item yang baru ditambahkan
      await historyModel.create({
        itemId: response.id,
        userId: req.userId,
        machineId: response.machineId,
        prevStock: 0,
        usedStock: stok,
        afterStock: stok,
        itemName: name,
        machineName: machine.machine_name,
        sectionName: section.section_name,
        changeType: "Tambah Item Baru",
        description,
      });

      // Log the create action in the audit logs
      await logAuditEvent("Item", response.id, "create", {
        name: response.name,
        stok: response.stok,
        description,
        lowerLimit,
      });

      // Check stock levels
      await checkStockLevels();

      return res.status(201).json({ message: "Item created", data: response });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addStockItem = async (req, res) => {
  try {
    const item = await itemModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
  } catch (error) {}
};

export const updateItem = async (req, res) => {
  try {
    const item = await itemModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!item) return res.status(404).json({ message: "item not found" });
    const { name, stok, lowerLimit } = req.body;
    let response;
    if (req.role === "admin") {
      response = await itemModel.update(
        { name, stok, lowerLimit },
        {
          where: {
            id: item.id,
          },
        }
      );
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to update this item" });
      response = await itemModel.update(
        { name, stok, lowerLimit },
        {
          where: {
            [Op.and]: [{ id: item.id }, { userId: req.userId }],
          },
        }
      );
    }

    // Log the update action
    // Log the update action in the audit logs
    await logAuditEvent("Item", item.id, "update", { name, stok, lowerLimit });

    // Check stock levels
    await checkStockLevels();

    res.status(200).json({ message: "item updated" });
  } catch (error) {
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
    if (!item) return res.status(404).json({ message: "item not found" });
    let response;
    if (req.role === "admin") {
      response = await itemModel.update(
        { deletedAt: new Date() }, // Perform soft delete
        {
          where: {
            id: item.id,
          },
        }
      );
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to delete this item" });
      response = await itemModel.update(
        { deletedAt: new Date() }, // Perform soft delete
        {
          where: {
            [Op.and]: [{ id: item.id }, { userId: req.userId }],
          },
        }
      );
    }

    await historyModel.create({
      itemId: item.id,
      userId: req.userId,
      machineId: item.machineId,
      prevStock: item.stok,
      usedStock: item.stok,
      afterStock: 0,
      itemName: item.name,
      machineName: item.machineName, // Make sure you have these attributes in the item
      sectionName: item.sectionName, // Make sure you have these attributes in the item
      changeType: "DELETE",
      description: "Item deleted",
    });

    // Log the delete action in the audit logs
    await logAuditEvent("Item", item.id, "delete", { name: item.name, stok: item.stok });

    res.status(200).json({ message: "item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
