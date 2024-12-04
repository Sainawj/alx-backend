#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createClient, print } from 'redis'; 
// Import Redis client and response handler.

const client = createClient(); 
// Initialize Redis client.

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});
// Handle connection errors.

const updateHash = (hashName, fieldName, fieldValue) => {
  client.HSET(hashName, fieldName, fieldValue, print); 
  // Add or update a field in a Redis hash and log the result.
};

const printHash = (hashName) => {
  client.HGETALL(hashName, (_err, reply) => console.log(reply)); 
  // Retrieve and display all fields and values of a Redis hash.
};

function main() {
  const hashObj = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  }; 
  // Define hash fields and values.

  for (const [field, value] of Object.entries(hashObj)) {
    updateHash('HolbertonSchools', field, value); 
    // Populate the Redis hash.
  }

  printHash('HolbertonSchools'); 
  // Display the hash content.
}

client.on('connect', () => {
  console.log('Redis client connected to the server'); 
  // Log successful connection.
  main(); 
  // Execute main logic after connection.
});

