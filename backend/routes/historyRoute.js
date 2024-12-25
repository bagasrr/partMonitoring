import express from "express";
import { createHistory, getHistoryByItem } from "../controller/histories.js";

const historyRoute = express.Router();

historyRoute.post("/", createHistory);
historyRoute.get("/", getHistoryByItem);

export default historyRoute;
