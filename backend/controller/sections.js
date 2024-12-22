import { sectionModel, userModel } from "../models/index.js";
import { section } from "../models/section.js";
import { user } from "../models/user.js";

export const getAllSection = async (req, res) => {
  let response;
  try {
    response = await sectionModel.findAll({
      attributes: ["uuid", "section_name", "section_number"],
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const response = await sectionModel.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: ["uuid", "section_name", "section_number"],
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
      ],
    });
    if (response === null) return res.status(404).json({ message: "section not found" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSection = async (req, res) => {
  const { section_name, section_number } = req.body;
  const section = await sectionModel.findOne({
    where: {
      section_name,
    },
  });
  if (section) return res.status(400).json({ message: "section already exist" });
  try {
    const response = await sectionModel.create({
      section_name,
      section_number,
      userId: req.userId,
    });
    res.status(200).json({ message: "section created", response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSection = async (req, res) => {
  try {
    await sectionModel.destroy({ where: { uuid: req.params.id } });
    res.status(200).json({ message: "section deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSection = async (req, res) => {
  try {
    const section = await sectionModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!section) return res.status(404).json({ message: "section not available" });
    const { section_name, section_number } = req.body;
    let response;
    if (req.role === "admin") {
      response = await sectionModel.update(
        { section_name, section_number },
        {
          where: {
            id: section.id,
          },
        }
      );
    } else {
      if (req.userId !== section.userId) return res.status(403).json({ message: "You are not allowed to update this section" });
      response = await sectionModel.update(
        { section_name, section_number },
        {
          where: {
            [Op.and]: [{ id: section.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ message: "Section updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
