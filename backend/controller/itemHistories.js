import { itemHistoryModel, itemModel, machineModel, userModel, vendorModel } from "../models/index.js";

export const addItemHistories = async (itemId, userId, activities) => {
  try {
    await itemHistoryModel.create({
      itemId,
      userId,
      activities,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getItemHistories = async (req, res) => {
  try {
    const itemHistories = await itemHistoryModel.findAll({
      attributes: ["uuid", "activities"],
      include: [
        {
          model: itemModel,
          attributes: ["uuid", "name", "item_number", "amount", "description", "status", "lowerLimit", "year", "replacementType", "replacementDate", "dayUsed"],
          include: [
            {
              model: machineModel,
              attributes: ["uuid", "machine_name", "machine_number"],
            },
            {
              model: vendorModel,
              attributes: ["uuid", "vendor_name"],
            },
          ],
        },
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
      ],
    });
    res.status(200).json(itemHistories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
