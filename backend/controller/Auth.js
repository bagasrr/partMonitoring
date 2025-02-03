import { userModel } from "../models/index.js";
import argon2 from "argon2";

export const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Username is Required" });
  }

  const user = await userModel.findOne({
    where: {
      name: name,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "Invalid Username" });
  }

  const match = await argon2.verify(user.password, password);
  if (!match) {
    return res.status(400).json({ message: "Invalid password" });
  }

  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const userName = user.name;
  const userRole = user.role;
  res.status(200).json({ uuid, name: userName, role: userRole });
};

// export const Me = async (req, res) => {
//   if (!req.session.userId) {
//     return res.status(403).json({ message: "Please Login to Your Account" });
//   }
//   const user = await userModel.findOne({
//     attributes: ["uuid", "name", "role"],
//     where: {
//       uuid: req.session.userId,
//     },
//   });
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.status(200).json(user);
// };

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).json({ message: "Please Login to Your Account" });
  }

  // Gunakan data dari session jika sudah ada untuk menghindari query ke database berulang
  if (!req.session.userData) {
    const user = await userModel.findOne({
      attributes: ["uuid", "name", "role"],
      where: { uuid: req.session.userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Simpan data ke session
    req.session.userData = {
      uuid: user.uuid,
      name: user.name,
      role: user.role,
    };
  }

  res.status(200).json(req.session.userData);
};

export const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(200).json({ message: "Logout success" });
  });
};
