import db from "../config/index.js";
import { images } from "./images.js";
import { item } from "./item.js";
import { machine } from "./Machine.js";
import { section } from "./section.js";
import { user } from "./user.js";

export const userModel = db.define("user", user);
export const itemModel = db.define("item", item);
export const imagesModel = db.define("images", images);
export const machineModel = db.define("machine", machine);
export const sectionModel = db.define("section", section);

userModel.hasMany(itemModel);
itemModel.belongsTo(userModel, {
  foreignKey: "userId",
});

userModel.hasMany(machineModel);
machineModel.belongsTo(userModel, {
  foreignKey: "userId",
});

userModel.hasMany(sectionModel);
sectionModel.belongsTo(userModel, {
  foreignKey: "userId",
});

sectionModel.hasMany(machineModel);
machineModel.belongsTo(sectionModel, {
  foreignKey: "sectionId",
});

machineModel.hasMany(itemModel);
itemModel.belongsTo(machineModel, {
  foreignKey: "machineId",
});
