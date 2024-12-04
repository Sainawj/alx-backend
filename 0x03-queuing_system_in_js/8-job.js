#!/usr/bin/yarn dev
import { Queue, Job } from 'kue';

/**
 * Creates push notification jobs from the array of jobs info.
 * @param {Job[]} jobs - Array of job details, each containing phone number and message.
 * @param {Queue} queue - The queue instance for managing jobs.
 */
export const createPushNotificationsJobs = (jobs, queue) => {
  // Ensure 'jobs' is an array.
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through each job in the 'jobs' array.
  for (const jobInfo of jobs) {
    // Create a new job for 'push_notification_code_3' event type.
    const job = queue.create('push_notification_code_3', jobInfo);

    // Attach event listeners to the job.
    job
      .on('enqueue', () => {
        console.log('Notification job created:', job.id); // Log when job is created.
      })
      .on('complete', () => {
        console.log('Notification job', job.id, 'completed'); // Log when job is completed.
      })
      .on('failed', (err) => {
        console.log('Notification job', job.id, 'failed:', err.message || err.toString()); // Log on failure.
      })
      .on('progress', (progress, _data) => {
        console.log('Notification job', job.id, `${progress}% complete`); // Log progress updates.
      });

    // Save the job to the queue.
    job.save();
  }
};

// Export function for external usage.
export default createPushNotificationsJobs;

