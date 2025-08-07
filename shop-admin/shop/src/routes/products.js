const express = require('express');
const router = express.Router();
const { Product, ProductAttributeValue } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { title, price, stock, categoryId, attributes } = req.body;

    const product = await Product.create({
      title,
      price,
      stock,
      categoryId,
      // ...other fields
    });

    if (attributes && Array.isArray(attributes)) {
      for (const attr of attributes) {
        await ProductAttributeValue.create({
          productId: product.id,
          attributeId: attr.attributeId,
          value: attr.value,
        });
      }
    }

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;