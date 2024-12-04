#!/usr/bin/yarn test
import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  // Spy to capture console.log calls
  const BIG_BROTHER = sinon.spy(console);
  const QUEUE = createQueue({ name: 'push_notification_code_test' });

  // Set up the test mode before running the tests
  before(() => {
    QUEUE.testMode.enter(true);
  });

  // Clear the test mode after all tests are complete
  after(() => {
    QUEUE.testMode.clear();
    QUEUE.testMode.exit();
  });

  // Reset the spy between each test case to ensure clean state
  afterEach(() => {
    BIG_BROTHER.log.resetHistory();
  });

  // Test if an error is thrown when 'jobs' is not an array
  it('displays an error message if jobs is not an array', () => {
    // Expect an error if the input is not an array
    expect(
      createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, QUEUE)
    ).to.throw('Jobs is not an array');
  });

  // Test if jobs are correctly added to the queue with the correct type
  it('adds jobs to the queue with the correct type', (done) => {
    // Initially check that the queue is empty
    expect(QUEUE.testMode.jobs.length).to.equal(0);
    
    // Define test jobs
    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];
    
    // Call the function to add jobs to the queue
    createPushNotificationsJobs(jobInfos, QUEUE);
    
    // Verify that jobs were added to the queue
    expect(QUEUE.testMode.jobs.length).to.equal(2);
    expect(QUEUE.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    expect(QUEUE.testMode.jobs[0].type).to.equal('push_notification_code_3');
    
    // Process the job and check the console log output
    QUEUE.process('push_notification_code_3', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job created:', QUEUE.testMode.jobs[0].id)
      ).to.be.true;
      done();
    });
  });

  // Test if progress event is handled correctly
  it('registers the progress event handler for a job', (done) => {
    // Add a listener for the progress event
    QUEUE.testMode.jobs[0].addListener('progress', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, '25% complete')
      ).to.be.true;
      done();
    });

    // Trigger the progress event
    QUEUE.testMode.jobs[0].emit('progress', 25);
  });

  // Test if failure event is handled correctly
  it('registers the failed event handler for a job', (done) => {
    // Add a listener for the failed event
    QUEUE.testMode.jobs[0].addListener('failed', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, 'failed:', 'Failed to send')
      ).to.be.true;
      done();
    });

    // Trigger the failure event
    QUEUE.testMode.jobs[0].emit('failed', new Error('Failed to send'));
  });

  // Test if completion event is handled correctly
  it('registers the complete event handler for a job', (done) => {
    // Add a listener for the complete event
    QUEUE.testMode.jobs[0].addListener('complete', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, 'completed')
      ).to.be.true;
      done();
    });

    // Trigger the completion event
    QUEUE.testMode.jobs[0].emit('complete');
  });
});

