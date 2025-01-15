import express from "express";
import { addItemAmount, createItem, deleteItem, getAllItems, getItemById, updateItem } from "../controller/items.js";

const itemRoute = express.Router();

itemRoute.get("/", getAllItems);
itemRoute.get("/:id", getItemById);
itemRoute.post("/", createItem);
itemRoute.patch("/add-amount", addItemAmount);
itemRoute.patch("/:id", updateItem);
itemRoute.delete("/:id", deleteItem);

export default itemRoute;
