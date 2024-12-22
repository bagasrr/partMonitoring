import express from "express";
import { createSection, deleteSection, getAllSection, getSectionById, updateSection } from "../controller/sections.js";

const sectionRoute = express.Router();

sectionRoute.get("/", getAllSection);
sectionRoute.get("/:id", getSectionById);
sectionRoute.post("/", createSection);
sectionRoute.patch("/:id", updateSection);
sectionRoute.delete("/:id", deleteSection);

export default sectionRoute;
