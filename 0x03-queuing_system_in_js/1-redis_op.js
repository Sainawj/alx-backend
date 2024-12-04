#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createClient, print } from 'redis'; 
// Import Redis client and utility to print responses.

const client = createClient(); 
// Initialize Redis client.

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});
// Handle connection errors.

client.on('connect', () => {
  console.log('Redis client connected to the server');
});
// Log successful connection.

const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print); 
  // Set a key-value pair in Redis and log the result.
};

const displaySchoolValue = (schoolName) => {
  client.GET(schoolName, (_err, reply) => {
    console.log(reply); 
    // Retrieve and display the value for a key.
  });
};

// Demonstrate Redis operations
displaySchoolValue('Holberton'); 
setNewSchool('HolbertonSanFrancisco', '100'); 
displaySchoolValue('HolbertonSanFrancisco');

