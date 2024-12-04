#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createQueue } from 'kue'; 
// Import Kue for job queue management.

const queue = createQueue(); 
// Create a job queue.

const sendNotification = (phoneNumber, message) => {
  console.log(
    `Sending notification to ${phoneNumber},`,
    'with message:',
    message,
  );
};
// Function to send notification, logs the phone number and message.

queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done(); 
  // Process the job and send the notification, then mark job as done.
});

