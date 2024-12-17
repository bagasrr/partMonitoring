import { userModel } from "../models/index.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(403).json({ message: "Please Login to Your Account" });
  }
  const user = await userModel.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });
  req.userId = user.id;
  req.name = user.name;
  req.role = user.role;
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await userModel.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (req.role !== "admin") return res.status(403).json({ message: "You are not an admin" });
  next();
};
