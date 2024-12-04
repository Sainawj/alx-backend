#!/usr/bin/yarn dev
import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';

// Sample list of products
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Initialize Redis client and promisify relevant functions
const client = createClient();
const getAsync = promisify(client.GET).bind(client);
const setAsync = promisify(client.SET).bind(client);
const PORT = 1245;

/**
 * Retrieves a product item by ID from the list of products.
 * @param {number} id - The id of the item.
 * @returns {object | undefined} - The product item or undefined if not found.
 */
const getItemById = (id) => listProducts.find(obj => obj.itemId === id);

/**
 * Reserves stock for an item in Redis.
 * @param {number} itemId - The id of the item.
 * @param {number} stock - The stock to reserve for the item.
 */
const reserveStockById = (itemId, stock) => setAsync(`item.${itemId}`, stock);

/**
 * Retrieves the current reserved stock for an item from Redis.
 * @param {number} itemId - The id of the item.
 * @returns {Promise<string>} - A promise resolving to the reserved stock count.
 */
const getCurrentReservedStockById = (itemId) => getAsync(`item.${itemId}`);

// API route to get all products
app.get('/list_products', (_, res) => {
  res.json(listProducts);
});

// API route to get details of a specific product by ID
app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = Number(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    return res.json({ status: 'Product not found' });
  }

  // Get the current reserved stock and update the product quantity
  getCurrentReservedStockById(itemId)
    .then((result) => Number(result || 0))
    .then((reservedStock) => {
      productItem.currentQuantity = productItem.initialAvailableQuantity - reservedStock;
      res.json(productItem);
    });
});

// API route to reserve a product by ID
app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    return res.json({ status: 'Product not found' });
  }

  // Check the current reserved stock before allowing reservation
  getCurrentReservedStockById(itemId)
    .then((result) => Number(result || 0))
    .then((reservedStock) => {
      if (reservedStock >= productItem.initialAvailableQuantity) {
        return res.json({ status: 'Not enough stock available', itemId });
      }

      // Reserve one more unit of stock for the product
      reserveStockById(itemId, reservedStock + 1)
        .then(() => res.json({ status: 'Reservation confirmed', itemId }));
    });
});

// Reset all products' stock to 0 in Redis
const resetProductsStock = () => {
  return Promise.all(
    listProducts.map(item => setAsync(`item.${item.itemId}`, 0)),
  );
};

// Start the Express server and reset stock
app.listen(PORT, () => {
  resetProductsStock()
    .then(() => console.log(`API available on localhost port ${PORT}`));
});

export default app;

