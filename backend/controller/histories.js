import { historyModel, itemModel, machineModel, userModel } from "../models/index.js";

export const createHistory = async (req, res) => {
  const { itemId, userId, machineId, changeType, description } = req.body;

  try {
    const history = await historyModel.create({
      itemId,
      userId,
      machineId,
      changeType,
      description,
    });

    res.status(201).json({ message: "History created", history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistoryByItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const histories = await historyModel.findAll({
      where: { itemId },
      include: [
        { model: itemModel, attributes: ["name"] },
        { model: userModel, attributes: ["name"] },
        { model: machineModel, attributes: ["machine_name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
