"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ubah tipe data kolom machine_number menjadi STRING
    await queryInterface.changeColumn("machines", "machine_number", {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Kembalikan tipe data kolom machine_number menjadi INTEGER
    await queryInterface.changeColumn("machines", "machine_number", {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    });
  },
};
