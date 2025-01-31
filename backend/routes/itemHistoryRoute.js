import express from "express";
import { getItemHistories } from "../controller/itemHistories.js";

const itemHistoryRoute = express.Router();

itemHistoryRoute.get("/", getItemHistories);

export default itemHistoryRoute;
