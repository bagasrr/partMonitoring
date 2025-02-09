import express from "express";
import {
  addItemAmount,
  createItem,
  deleteItem,
  getAllItems,
  getBrokenItems,
  getInUseItems,
  getItemById,
  getItemType,
  getRepairItems,
  getReplaceItem,
  getSpareItems,
  getSwapItem,
  getSwapReplaceItem,
  replaceItem,
  swapItem,
  updateItem,
  updateItemStatus,
  updateItemStatusForm,
} from "../controller/items.js";

const itemRoute = express.Router();

itemRoute.use((req, res, next) => {
  console.log(`Received request for items route: ${req.url}`);
  next();
});

itemRoute.get("/", getAllItems);

itemRoute.get("/type-:type", getItemType);
itemRoute.get("/type-replace", getReplaceItem);
itemRoute.get("/type-swap", getSwapItem);
itemRoute.get("/type-swap/machine", getSwapReplaceItem);

itemRoute.get("/spare", getSpareItems);
itemRoute.get("/in-use", getInUseItems);
itemRoute.get("/repair", getRepairItems);
itemRoute.get("/broken", getBrokenItems);

itemRoute.patch("/change/swap", swapItem);
itemRoute.patch("/change/replace", replaceItem);
itemRoute.patch("/add-amount", addItemAmount);
itemRoute.patch("/status", updateItemStatusForm);

itemRoute.post("/", createItem);

itemRoute.get("/:id", getItemById);
itemRoute.patch("/:id", updateItem);
itemRoute.patch("/:id/status", updateItemStatus);
itemRoute.patch("/:id/delete", deleteItem);

export default itemRoute;
