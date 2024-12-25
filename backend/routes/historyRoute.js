import express from "express";
import { createHistory, getHistories } from "../controller/histories.js";

const historyRoute = express.Router();

historyRoute.post("/", createHistory);
historyRoute.get("/", getHistories);

export default historyRoute;
