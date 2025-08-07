module.exports = (sequelize, DataTypes) => {
  const ProductAttributeValue = sequelize.define('ProductAttributeValue', {
    productId: DataTypes.INTEGER,
    attributeId: DataTypes.INTEGER,
    value: DataTypes.STRING,
  });

  ProductAttributeValue.associate = models => {
    ProductAttributeValue.belongsTo(models.Product, { foreignKey: 'productId' });
    ProductAttributeValue.belongsTo(models.Attribute, { foreignKey: 'attributeId' });
  };

  return ProductAttributeValue;
};