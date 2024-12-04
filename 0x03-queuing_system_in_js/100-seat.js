#!/usr/bin/yarn dev
import express from 'express';
import { promisify } from 'util';
import { createQueue } from 'kue';
import { createClient } from 'redis';

const app = express();
const client = createClient({ name: 'reserve_seat' });
const queue = createQueue();
const INITIAL_SEATS_COUNT = 50; // Default initial seat count
let reservationEnabled = false; // Flag to check if reservation is allowed
const PORT = 1245;

/**
 * Modifies the number of available seats in Redis.
 * @param {number} number - The new number of seats.
 * @returns {Promise}
 */
const reserveSeat = async (number) => {
  return promisify(client.SET).bind(client)('available_seats', number);
};

/**
 * Retrieves the current number of available seats from Redis.
 * @returns {Promise<String>}
 */
const getCurrentAvailableSeats = async () => {
  return promisify(client.GET).bind(client)('available_seats');
};

/**
 * Endpoint to fetch the current available seats.
 */
app.get('/available_seats', async (_, res) => {
  try {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: Number.parseInt(numberOfAvailableSeats || 0) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve available seats' });
  }
});

/**
 * Endpoint to reserve a seat if reservations are enabled.
 */
app.get('/reserve_seat', async (_req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  try {
    const job = queue.create('reserve_seat');
    
    // Handle job completion and failure events
    job.on('failed', (err) => {
      console.error(`Seat reservation job ${job.id} failed: ${err.message || err.toString()}`);
    });
    job.on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    });
    job.save();
    
    res.json({ status: 'Reservation in process' });
  } catch (error) {
    res.json({ status: 'Reservation failed' });
  }
});

/**
 * Endpoint to trigger processing of the queue for seat reservations.
 */
app.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (_job, done) => {
    try {
      const availableSeats = await getCurrentAvailableSeats();
      const seatsLeft = Number.parseInt(availableSeats || 0);
      reservationEnabled = seatsLeft > 1 ? true : false;

      if (seatsLeft > 0) {
        await reserveSeat(seatsLeft - 1); // Decrease available seats by 1
        done(); // Mark job as completed
      } else {
        done(new Error('Not enough seats available')); // Handle error when no seats left
      }
    } catch (error) {
      done(error); // Pass error to done if any issue occurs
    }
  });
});

/**
 * Resets the available seats to the initial value.
 * @param {number} initialSeatsCount - Initial number of available seats.
 * @returns {Promise}
 */
const resetAvailableSeats = async (initialSeatsCount) => {
  return promisify(client.SET).bind(client)('available_seats', initialSeatsCount);
};

/**
 * Start the server and initialize the available seats.
 */
app.listen(PORT, async () => {
  try {
    const initialSeats = process.env.INITIAL_SEATS_COUNT || INITIAL_SEATS_COUNT;
    await resetAvailableSeats(Number(initialSeats)); // Set available seats to initial value
    reservationEnabled = true; // Enable reservations after initializing seats
    console.log(`API available on localhost port ${PORT}`);
  } catch (error) {
    console.error('Error initializing seats:', error);
  }
});

export default app;

