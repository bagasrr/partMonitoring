import express from "express";
import { createItemUseHistory, deleteItemUseHistory, getAllItemUseHistories, getItemUseHistoryById, updateItemUseHistory } from "../controller/itemUseHistory.js";

const itemUseHistoryRoute = express.Router();

itemUseHistoryRoute.get("/", getAllItemUseHistories);
itemUseHistoryRoute.get("/:id", getItemUseHistoryById);
itemUseHistoryRoute.post("/", createItemUseHistory);
itemUseHistoryRoute.put("/:id", updateItemUseHistory);
itemUseHistoryRoute.delete("/:id", deleteItemUseHistory);

export default itemUseHistoryRoute;
