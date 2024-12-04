#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createClient } from 'redis'; 
// Import Redis client creation method.

const client = createClient(); 
// Create a Redis client instance.

client.on('error', (err) => {
  console.log('Redis client not connected:', err.toString());
});
// Handle connection errors.

client.on('connect', () => {
  console.log('Redis client connected to the server');
});
// Log successful connection.

