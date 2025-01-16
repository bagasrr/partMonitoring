import express from "express";
import { addItemAmount, createItem, deleteItem, getAllItems, getItemById, updateItem, updateItemStatus } from "../controller/items.js";

const itemRoute = express.Router();

itemRoute.get("/", getAllItems);
itemRoute.get("/:id", getItemById);
itemRoute.post("/", createItem);
itemRoute.patch("/add-amount", addItemAmount);
itemRoute.patch("/:id", updateItem);
itemRoute.patch("/:id/status", updateItemStatus);
itemRoute.delete("/:id", deleteItem);

export default itemRoute;
