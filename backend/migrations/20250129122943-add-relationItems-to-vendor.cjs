"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("items", {
      fields: ["vendorId"],
      type: "foreign key",
      name: "vendorId", // nama constraint
      references: {
        table: "vendors",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("items", "vendorId");
  },
};
