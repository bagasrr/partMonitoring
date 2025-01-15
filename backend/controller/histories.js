import { historyModel, itemModel, machineModel, userModel } from "../models/index.js";

// export const createHistory = async (req, res) => {
//   const { changeType, description, itemName, usedStock } = req.body;

//   try {
//     const item = await itemModel.findOne({
//       where: {
//         name: itemName,
//       },
//     });
//     console.log(usedStock);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     const response = await historyModel.create({
//       itemId: item.id,
//       userId: req.userId,
//       machineId: item.machineId,
//       prevStock: item.stok,
//       usedStock,
//       afterStock: item.stok - usedStock,
//       changeType,
//       description,
//     });

//     await itemModel.update({ stok: response.afterStock }, { where: { id: item.id } });

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getHistories = async (req, res) => {
  try {
    const response = await historyModel.findAll({
      // attributes: ["uuid", "name", "machine", "prevStock", "usedStock", "afterStock", "changeType", "description"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
