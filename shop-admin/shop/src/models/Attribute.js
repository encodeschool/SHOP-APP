module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define('Attribute', {
    name: DataTypes.STRING,
    type: DataTypes.ENUM('TEXT', 'NUMBER', 'DROPDOWN'),
    options: DataTypes.ARRAY(DataTypes.STRING), // e.g. ['Red', 'Blue']
    isRequired: DataTypes.BOOLEAN,
    categoryId: DataTypes.INTEGER,
  });

  Attribute.associate = models => {
    Attribute.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };

  return Attribute;
};