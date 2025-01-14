"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("items", "description", {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("items", "description");
  },
};
