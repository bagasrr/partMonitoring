import db from "../config/index.js";
import { AuditLog } from "./auditLog.js";
import { history } from "./history.js";
// import { images } from "./images.js";
import { item } from "./item.js";
import { machine } from "./Machine.js";
import { section } from "./section.js";
import { user } from "./user.js";

export const userModel = db.define("user", user);
export const itemModel = db.define("item", item, { paranoid: true });
// export const imagesModel = db.define("images", images);
export const machineModel = db.define("machine", machine, { paranoid: true });
export const sectionModel = db.define("section", section, { paranoid: true });
export const historyModel = db.define("history", history, { paranoid: true });
export const AuditLogModel = db.define("audit_log", AuditLog);

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

// itemModel.hasMany(historyModel);
// historyModel.belongsTo(itemModel, {
//   foreignKey: "itemId",
// });
// machineModel.hasMany(historyModel);
// historyModel.belongsTo(machineModel, {
//   foreignKey: "machineId",
// });

// userModel.hasMany(historyModel);
// historyModel.belongsTo(userModel, {
//   foreignKey: "userId",
// });
