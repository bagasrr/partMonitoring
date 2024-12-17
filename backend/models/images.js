import { DataTypes } from "sequelize";

export const images = {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
};
