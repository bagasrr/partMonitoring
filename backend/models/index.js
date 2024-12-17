import db from "../config/index.js";
import { images } from "./images.js";
import { item } from "./item.js";
import { user } from "./user.js";

export const userModel = db.define("user", user);
export const itemModel = db.define("item", item);
export const imagesModel = db.define("images", images);

userModel.hasMany(itemModel);
itemModel.belongsTo(userModel, {
  foreignKey: "userId",
});

itemModel.hasMany(imagesModel);
imagesModel.belongsTo(itemModel);
