"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn("items", "replacementType", {
      type: DataTypes.ENUM("Swap", "Replace"),
      allowNull: false,
      defaultValue: "Swap",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("items", "replacementType");
  },
};
