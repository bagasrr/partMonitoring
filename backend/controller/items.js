import { imagesModel, itemModel, userModel } from "../models/index.js";
import { Op } from "sequelize";
export const getAllItems = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await itemModel.findAll({
        attributes: ["uuid", "name", "stok"],
        include: [
          {
            model: userModel,
            attributes: ["uuid", "name", "role"],
          },
          {
            model: imagesModel,
            attributes: ["uuid", "url"],
          },
        ],
      });
    } else {
      response = await itemModel.findAll({
        attributes: ["uuid", "name", "stok"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: userModel,
            attributes: ["uuid", "name", "role"],
          },
          {
            model: imagesModel,
            attributes: ["uuid", "url"],
          },
        ],
      });
    }
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
            model: imagesModel,
            attributes: ["uuid", "url"],
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
            model: imagesModel,
            attributes: ["uuid", "url"],
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
  const { name, stok } = req.body;
  try {
    const prevData = await itemModel.findOne({
      where: {
        name,
      },
    });
    if (prevData) {
      const response = await itemModel.update({ stok: prevData.stok + stok }, { where: { id: prevData.id } });
      res.status(200).json({ message: "item created", data: response });
    } else {
      const response = await itemModel.create({
        name,
        stok,
        userId: req.userId,
      });
      res.status(200).json({ message: "item created", data: response });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const { name, stok } = req.body;
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
    res.status(200).json({ message: "item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
