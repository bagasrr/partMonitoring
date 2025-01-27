"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("items", "replacementDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("items", "replacementDate", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
