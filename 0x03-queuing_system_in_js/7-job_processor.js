#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createQueue, Job } from 'kue'; 
// Import Kue for job queue management.

const BLACKLISTED_NUMBERS = ['4153518780', '4153518781']; 
// List of blacklisted phone numbers.
const queue = createQueue(); 
// Create a queue for push notification jobs.

/**
 * Sends a push notification to a user.
 * @param {String} phoneNumber - User's phone number.
 * @param {String} message - Notification message.
 * @param {Job} job - The job instance.
 * @param {*} done - Callback to mark job completion.
 */
const sendNotification = (phoneNumber, message, job, done) => {
  let total = 2, pending = 2;
  let sendInterval = setInterval(() => {
    // Update job progress after reaching halfway completion.
    if (total - pending <= total / 2) {
      job.progress(total - pending, total);
    }
    
    // Check if the phone number is blacklisted.
    if (BLACKLISTED_NUMBERS.includes(phoneNumber)) {
      done(new Error(`Phone number ${phoneNumber} is blacklisted`));
      clearInterval(sendInterval);
      return;
    }

    // Log the message if fully pending.
    if (total === pending) {
      console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    }

    // Mark the job as completed when all steps are finished.
    --pending || done();
    pending || clearInterval(sendInterval);
  }, 1000);
};

// Process the job with a concurrency of 2 workers.
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

