#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createClient } from 'redis'; 
// Import Redis client.

const client = createClient(); 
// Initialize Redis client.

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});
// Handle connection errors.

const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message); 
    // Publish a message to the Redis channel after a delay.
  }, time);
};

client.on('connect', () => {
  console.log('Redis client connected to the server');
});
// Log successful connection.

publishMessage('Holberton Student #1 starts course', 100); 
// Publish message after 100ms.
publishMessage('Holberton Student #2 starts course', 200); 
// Publish message after 200ms.
publishMessage('KILL_SERVER', 300); 
// Publish the exit message after 300ms.
publishMessage('Holberton Student #3 starts course', 400); 
// Publish message after 400ms.

