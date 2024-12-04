#!/usr/bin/yarn dev
// Use Yarn's development environment.

import { createQueue } from 'kue'; 
// Import Kue for job queue management.

// List of jobs with phone numbers and verification messages.
const jobs = [
  { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
  { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153518743', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153538781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153118782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4159518782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4158718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153818782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4154318781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4151218782', message: 'This is the code 4321 to verify your account' },
];

// Create a job queue for push notifications.
const queue = createQueue({ name: 'push_notification_code_2' });

// Iterate through the jobs and create a job for each.
for (const jobInfo of jobs) {
  const job = queue.create('push_notification_code_2', jobInfo);

  // Define event listeners for job lifecycle events.
  job
    .on('enqueue', () => {
      console.log('Notification job created:', job.id); // Log job creation.
    })
    .on('complete', () => {
      console.log('Notification job', job.id, 'completed'); // Log job completion.
    })
    .on('failed', (err) => {
      console.log('Notification job', job.id, 'failed:', err.message || err.toString()); // Log failure.
    })
    .on('progress', (progress, _data) => {
      console.log('Notification job', job.id, `${progress}% complete`); // Log job progress.
    });
  
  job.save(); // Save and enqueue the job.
}

