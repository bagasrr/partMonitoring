import { itemHistoryModel } from "../models/index.js";

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
