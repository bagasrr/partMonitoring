import { itemModel, itemUseHistoryModel, machineModel } from "../models/index.js";

export const getAllItemUseHistories = async (req, res) => {
  try {
    const histories = await itemUseHistoryModel.findAll({
      include: [
        {
          model: itemModel,
          as: "item", // Alias untuk item yang digunakan
          attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
          include: [{ model: machineModel, attributes: ["machine_name"], paranoid: false }],
          paranoid: false,
        },

        {
          model: itemModel,
          as: "replacementItem", // Alias untuk item pengganti
          attributes: ["uuid", "item_number", "name", "amount", "description", "status", "lowerLimit", "year", "replacementType"],
          include: [{ model: machineModel, attributes: ["machine_name"], paranoid: false }],
          paranoid: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemUseHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await itemUseHistoryModel.findOne({ where: { uuid: id } });
    if (!history) {
      return res.status(404).json({ message: "Item use history not found" });
    }
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItemUseHistory = async (req, res) => {
  try {
    const newHistory = await itemUseHistoryModel.create(req.body);
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItemUseHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await itemUseHistoryModel.update(req.body, { where: { uuid: id } });
    if (!updated) {
      return res.status(404).json({ message: "Item use history not found" });
    }
    const updatedHistory = await itemUseHistoryModel.findOne({ where: { uuid: id } });
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItemUseHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await itemUseHistoryModel.destroy({ where: { uuid: id } });
    if (!deleted) {
      return res.status(404).json({ message: "Item use history not found" });
    }
    res.status(204).json({ message: "Item use history deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
