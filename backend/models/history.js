import { DataTypes } from "sequelize";

export const history = {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  prevStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  usedStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  afterStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
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
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  changeType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};
