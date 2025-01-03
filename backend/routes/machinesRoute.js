import express from "express";
import { addMachine, deleteMachine, getMachineById, getMachines, getMachinesWithItems, updateMachine } from "../controller/machines.js";

const machinesRoute = express.Router();

machinesRoute.get("/", getMachines);
machinesRoute.get("/with-items", getMachinesWithItems);
machinesRoute.get("/:id", getMachineById);
machinesRoute.post("/", addMachine);
machinesRoute.patch("/:id", updateMachine);
machinesRoute.delete("/:id", deleteMachine);

export default machinesRoute;
