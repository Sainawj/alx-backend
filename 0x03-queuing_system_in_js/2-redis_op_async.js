#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { promisify } from 'util';
import { createClient, print } from 'redis';
// Import utilities for Redis client and response handling.

const client = createClient(); 
// Initialize Redis client.

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});
// Handle connection errors.

const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print); 
  // Set a key-value pair in Redis and log the result.
};

const displaySchoolValue = async (schoolName) => {
  const getAsync = promisify(client.GET).bind(client); 
  // Promisify Redis GET operation.
  console.log(await getAsync(schoolName)); 
  // Retrieve and display the value for a key.
};

async function main() {
  await displaySchoolValue('Holberton'); 
  // Display the value for 'Holberton'.
  setNewSchool('HolbertonSanFrancisco', '100'); 
  // Set a new key-value pair.
  await displaySchoolValue('HolbertonSanFrancisco'); 
  // Display the value for 'HolbertonSanFrancisco'.
}

client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main(); 
  // Execute main logic after connection.
});

