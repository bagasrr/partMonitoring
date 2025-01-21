import express from "express";
import { addItemAmount, changeItem, createItem, deleteItem, getAllItems, getItemById, getItemsByMachineId, updateItem, updateItemStatus } from "../controller/items.js";

const itemRoute = express.Router();

itemRoute.get("/", getAllItems);
itemRoute.patch("/change", changeItem);
itemRoute.get("/:id", getItemById);
itemRoute.get("/bymachine", getItemsByMachineId);
itemRoute.post("/", createItem);
itemRoute.patch("/add-amount", addItemAmount);
itemRoute.patch("/:id", updateItem);
itemRoute.patch("/:id/status", updateItemStatus);
itemRoute.delete("/:id", deleteItem);

export default itemRoute;
