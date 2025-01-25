import express from "express";
import { addItemAmount, createItem, deleteItem, getAllItems, getItemById, getReplaceItem, getSwapItem, getSwapReplaceItem, swapItem, updateItem, updateItemStatus } from "../controller/items.js";

const itemRoute = express.Router();

itemRoute.use((req, res, next) => {
  console.log(`Received request for items route: ${req.url}`);
  next();
});

itemRoute.get("/", getAllItems);
itemRoute.get("/type-replace", getReplaceItem);
itemRoute.get("/type-swap", getSwapItem);
itemRoute.get("/type-swap/machine", getSwapReplaceItem);

itemRoute.patch("/change/swap", swapItem);
itemRoute.patch("/add-amount", addItemAmount);

itemRoute.post("/", createItem);

itemRoute.get("/:id", getItemById);
itemRoute.patch("/:id", updateItem);
itemRoute.patch("/:id/status", updateItemStatus);
itemRoute.delete("/:id", deleteItem);

export default itemRoute;
