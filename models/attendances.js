'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attendances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users)
    }
  }
  attendances.init({
    id_user: DataTypes.INTEGER,
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'attendances',
  });
  return attendances;
};