import { DataTypes } from "sequelize";

export const ItemUseHistory = {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  replacementItemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  itemStartUseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  itemEndUseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  useCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  machineId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dayUsed: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
};
