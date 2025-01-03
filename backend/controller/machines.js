import { Op } from "sequelize";
import { itemModel, machineModel } from "../models/index.js";
import { sectionModel } from "../models/index.js";
import { userModel } from "../models/index.js";

// Menambahkan mesin baru
export const addMachine = async (req, res) => {
  const { machine_name, machine_number, section_name, section_number } = req.body;

  const macine = await machineModel.findOne({
    where: {
      machine_name: machine_name,
    },
  });
  if (macine) return res.status(400).json({ message: "Machine already exist" });
  try {
    let section = await sectionModel.findOne({ where: { section_name } });

    if (!section) {
      section = await sectionModel.create({
        section_name,
        section_number,
        userId: req.userId,
      });
    }

    // Buat mesin dengan sectionId dan userId
    const newMachine = await machineModel.create({
      machine_name,
      machine_number,
      sectionId: section.id,
      userId: req.userId,
    });

    res.status(201).json(newMachine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan semua mesin
export const getMachines = async (req, res) => {
  try {
    const response = await machineModel.findAll({
      attributes: ["uuid", "machine_name", "machine_number"],
      include: [
        {
          model: userModel,
          attributes: ["uuid", "name", "role"],
        },
        {
          model: sectionModel,
          attributes: ["uuid", "section_name", "section_number"],
        },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan mesin berdasarkan ID
export const getMachineById = async (req, res) => {
  try {
    const machine = await machineModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    let response;
    if (req.role === "admin") {
      response = await machineModel.findOne({
        where: {
          id: machine.id,
        },
        attributes: ["uuid", "machine_name", "machine_number"],
        include: [
          {
            model: userModel,
            attributes: ["uuid", "name", "role"],
          },
          {
            model: sectionModel,
            attributes: ["uuid", "section_name", "section_number"],
          },
        ],
      });
      res.status(200).json(response);
    } else {
      response = await machineModel.findOne({
        where: {
          [Op.and]: [{ id: machine.id }, { userId: req.userId }],
        },
        attributes: ["uuid", "machine_name", "machine_number"],
        include: [
          {
            model: userModel,
            attributes: ["uuid", "name", "role"],
          },
          {
            model: sectionModel,
            attributes: ["uuid", "section_name", "section_number"],
          },
        ],
      });
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui mesin
export const updateMachine = async (req, res) => {
  try {
    const machine = await machineModel.findOne({
      where: { uuid: req.params.id },
    });
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    const { machine_name, machine_number, section_name, section_number } = req.body;
    const userId = req.userId;
    let newSection;

    if (req.role === "admin") {
      await machineModel.update({ machine_name, machine_number }, { where: { id: machine.id } });

      let section = await sectionModel.findOne({ where: { section_name } });

      if (!section) {
        newSection = await sectionModel.create({ section_name, section_number, userId });
      } else {
        await sectionModel.update({ section_name, section_number }, { where: { id: section.id } });
        newSection = section;
      }

      machine.sectionId = newSection.id;
      await machine.save();

      res.status(200).json({ message: "Update Success", machine });
    } else {
      if (userId !== machine.userId) {
        return res.status(403).json({ message: "You are not allowed to update this machine" });
      }

      await machineModel.update(
        { machine_name, machine_number },
        {
          where: {
            [Op.and]: [{ id: machine.id }, { userId: userId }],
          },
        }
      );

      let section = await sectionModel.findOne({ where: { section_name } });

      if (!section) {
        newSection = await sectionModel.create({ section_name, section_number, userId });
      } else {
        await sectionModel.update({ section_name, section_number }, { where: { id: section.id } });
        newSection = section;
      }

      machine.sectionId = newSection.id;
      await machine.save();

      res.status(200).json({ message: "Update Success", machine });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus mesin
export const deleteMachine = async (req, res) => {
  try {
    const machine = await machineModel.findOne({ where: { uuid: req.params.id } });
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    await machine.destroy();
    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMachinesWithItems = async (req, res) => {
  try {
    const machines = await machineModel.findAll({
      include: {
        model: itemModel,
      },
    });
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
