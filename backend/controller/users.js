import { userModel } from "../models/index.js";
import argon2, { hash } from "argon2";

export const getAllUser = async (req, res) => {
  try {
    const response = await userModel.findAll({
      attributes: ["uuid", "name", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await userModel.findOne({
      attributes: ["uuid", "name", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    if (!response) return res.status(404).json({ message: "user not found" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, password, confPassword, role } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({
      message: "password and confirm password not match",
    });
  }

  try {
    const hashPassword = await argon2.hash(password);
    const data = await userModel.create({
      name: name,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ message: "user created", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, password, confPassword, role } = req.body;

    // Use existing values if new ones are not provided
    const updatedName = name || user.name;
    const updatedRole = role || user.role;

    let hashPassword;
    if (!password) {
      hashPassword = user.password;
    } else {
      if (password !== confPassword) {
        return res.status(400).json({
          message: "Password and confirm password do not match",
        });
      }
      hashPassword = await argon2.hash(password);
    }

    await userModel.update(
      {
        name: updatedName,
        password: hashPassword,
        role: updatedRole,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await userModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  try {
    await userModel.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
