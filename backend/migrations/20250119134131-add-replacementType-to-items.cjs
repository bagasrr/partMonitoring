"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn("items", "replacementType", {
      type: DataTypes.ENUM("Swap", "Replace"),
      allowNull: false,
      defaultValue: "Swap",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("items", "replacementType");
  },
};
