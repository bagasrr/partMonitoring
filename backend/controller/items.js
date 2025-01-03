import { historyModel, imagesModel, itemModel, machineModel, sectionModel, userModel } from "../models/index.js";
import { Op } from "sequelize";
import { addMachine } from "./machines.js";
import { response } from "express";
export const getAllItems = async (req, res) => {
  try {
    let response;

    response = await itemModel.findAll({
      attributes: ["uuid", "name", "stok"],
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
      },
    });
    if (!items) return res.status(404).json({ message: "item not found" });
    let response;
    if (req.role === "admin") {
      response = await itemModel.findOne({
        attributes: ["uuid", "name", "stok"],
        where: {
          id: items.id,
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
          [Op.and]: [{ id: items.id }, { userId: req.userId }],
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
  const { name, stok, machine_name, machine_number, section_name, section_number, description } = req.body;

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
        changeType: "Part Masuk",
        description,
      });

      return res.status(200).json({ message: "Item updated" });
    } else {
      // Jika prevData tidak ditemukan, buat item baru
      const response = await itemModel.create({
        name,
        stok,
        userId: req.userId,
        machineId: machine.id,
      });

      // Buat histori baru untuk item yang baru ditambahkan
      await historyModel.create({
        itemId: response.id,
        userId: req.userId,
        machineId: response.machineId,
        prevStock: 0,
        usedStock: stok,
        afterStock: stok,
        changeType: "Add New Item",
        description,
      });

      return res.status(201).json({ message: "Item created", data: response });
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
      },
    });
    if (!item) return res.status(404).json({ message: "item not found" });
    const { name, stok } = req.body;
    let response;
    if (req.role === "admin") {
      response = await itemModel.update(
        { name, stok },
        {
          where: {
            id: item.id,
          },
        }
      );
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to update this item" });
      response = await itemModel.update(
        { name, stok },
        {
          where: {
            [Op.and]: [{ id: item.id }, { userId: req.userId }],
          },
        }
      );
    }
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
      response = await itemModel.destroy({
        where: {
          id: item.id,
        },
      });
    } else {
      if (req.userId !== item.userId) return res.status(403).json({ message: "You are not allowed to delete this item" });
      response = await itemModel.destroy({
        where: {
          [Op.and]: [{ id: item.id }, { userId: req.userId }],
        },
      });
    }

    await historyModel.create({
      itemId: item.id,
      userId: req.userId,
      machineId: item.machineId,
      prevStock: item.stok,
      usedStock: item.stok,
      afterStock: 0,
      changeType: "DELETE",
    });

    res.status(200).json({ message: "item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
