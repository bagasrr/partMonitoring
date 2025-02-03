import express from "express";
import { addSection, deleteSection, getAllSections, getItemsBySection, getSectionById, updateSection } from "../controller/sections.js";

const sectionRoute = express.Router();

sectionRoute.get("/", getAllSections);
sectionRoute.get("/:sectionId/items-:type", getItemsBySection);
sectionRoute.get("/:id", getSectionById);
sectionRoute.post("/", addSection);
sectionRoute.patch("/:id", updateSection);
sectionRoute.patch("/:id/delete", deleteSection);

export default sectionRoute;
