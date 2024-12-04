#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createClient } from 'redis'; 
// Import Redis client.

const client = createClient(); 
// Initialize Redis client.

const EXIT_MSG = 'KILL_SERVER'; 
// Message to signal server termination.

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});
// Handle connection errors.

client.on('connect', () => {
  console.log('Redis client connected to the server');
});
// Log successful connection.

client.subscribe('holberton school channel'); 
// Subscribe to a Redis channel.

client.on('message', (_err, msg) => {
  console.log(msg); 
  // Log received messages.
  if (msg === EXIT_MSG) {
    client.unsubscribe(); 
    // Unsubscribe from the channel.
    client.quit(); 
    // Terminate the Redis client.
  }
});

