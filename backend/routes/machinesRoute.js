import express from "express";
import { addMachine, deleteMachine, getMachineById, getMachines, getMachinesWithItems, updateMachine } from "../controller/machines.js";

const machinesRoute = express.Router();

machinesRoute.get("/", getMachines);
machinesRoute.get("/with-items", getMachinesWithItems);
machinesRoute.post("/", addMachine);

machinesRoute.get("/:id", getMachineById);
machinesRoute.patch("/:id", updateMachine);
machinesRoute.patch("/:id/delete", deleteMachine);

export default machinesRoute;
