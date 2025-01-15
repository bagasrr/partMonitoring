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
  name: {
    type: DataTypes.STRING,
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
  username: {
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
  category: {
    type: DataTypes.STRING,
    allowNull: false,
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
  newStock: {
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
};
