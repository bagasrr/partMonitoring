import { DataTypes } from "sequelize";

export const item = {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  item_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
    defaultValue: null,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Not Set",
  },
  lowerLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  machineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  replacementType: {
    type: DataTypes.ENUM("Swap", "Replace"),
    allowNull: false,
    defaultValue: "Swap",
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  replacementDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dayUsed: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
};
