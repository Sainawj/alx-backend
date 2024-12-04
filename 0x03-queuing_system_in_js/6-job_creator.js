#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createQueue } from 'kue'; 
// Import Kue for job queue management.

const queue = createQueue({ name: 'push_notification_code' }); 
// Create a queue for push notification jobs.

const job = queue.create('push_notification_code', {
  phoneNumber: '07045679939',
  message: 'Account registered',
});
// Create a job with phone number and message for notification.

job
  .on('enqueue', () => {
    console.log('Notification job created:', job.id);
  }) 
  // Log job creation event.

  .on('complete', () => {
    console.log('Notification job completed');
  }) 
  // Log job completion event.

  .on('failed attempt', () => {
    console.log('Notification job failed');
  }); 
  // Log job failure event.

job.save(); 
// Save and enqueue the job.

