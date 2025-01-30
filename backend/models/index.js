import db from "../config/index.js";
import { AuditLog } from "./auditLog.js";
import { history } from "./history.js";
// import { images } from "./images.js";
import { item } from "./item.js";
import { machine } from "./Machine.js";
import { section } from "./section.js";
import { user } from "./user.js";
import { ItemUseHistory } from "./itemUseHistory.js";
import { vendor } from "./vendor.js";
import { itemHistory } from "./itemHistory.js";

export const userModel = db.define("user", user);
export const itemModel = db.define("item", item, { paranoid: true });
export const itemHistoryModel = db.define("itemHistory", itemHistory, { paranoid: true });
// export const imagesModel = db.define("images", images);
export const machineModel = db.define("machine", machine, { paranoid: true });
export const sectionModel = db.define("section", section, { paranoid: true });
export const historyModel = db.define("history", history, { paranoid: true });
export const vendorModel = db.define("vendor", vendor, { paranoid: true });
export const AuditLogModel = db.define("audit_log", AuditLog);
export const itemUseHistoryModel = db.define("itemUseHistory", ItemUseHistory);

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

itemModel.hasMany(itemUseHistoryModel, { foreignKey: "itemId" });
itemUseHistoryModel.belongsTo(itemModel, { foreignKey: "itemId" });

itemModel.hasMany(itemUseHistoryModel, { foreignKey: "replacementItemId" });
itemUseHistoryModel.belongsTo(itemModel, { as: "replacementItem", foreignKey: "replacementItemId" });

machineModel.hasMany(itemUseHistoryModel, { foreignKey: "machineId" });
itemUseHistoryModel.belongsTo(machineModel, { foreignKey: "machineId" });

userModel.hasMany(vendorModel);
vendorModel.belongsTo(userModel, {
  foreignKey: "userId",
});

vendorModel.hasMany(itemModel);
itemModel.belongsTo(vendorModel, {
  foreignKey: "vendorId",
});

userModel.hasMany(itemHistoryModel);
itemHistoryModel.belongsTo(userModel, {
  foreignKey: "userId",
});

itemModel.hasMany(itemHistoryModel);
itemHistoryModel.belongsTo(itemModel, {
  foreignKey: "itemId",
});
