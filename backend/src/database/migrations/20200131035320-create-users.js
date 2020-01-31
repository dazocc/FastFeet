
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', { id: Sequelize.INTEGER }),

  down: (queryInterface) => queryInterface.dropTable('users'),
};
