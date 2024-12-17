import express from "express";
import { createItem, deleteItem, getAllItems, getItemById, updateItem } from "../controller/items.js";

const itemRoute = express.Router();

itemRoute.get("/", getAllItems);
itemRoute.get("/:id", getItemById);
itemRoute.post("/", createItem);
itemRoute.patch("/:id", updateItem);
itemRoute.delete("/:id", deleteItem);

export default itemRoute;
