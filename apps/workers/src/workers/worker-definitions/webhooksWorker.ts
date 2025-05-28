import { Queues } from '@latitude-data/core/queues/types'
import * as jobs from '@latitude-data/core/jobs/definitions'
import { createWorker } from '../utils/createWorker'
import { WORKER_CONNECTION_CONFIG } from '../utils/connectionConfig'

const jobMappings = {
  processWebhookJob: jobs.processWebhookJob,
  processIndividualWebhookJob: jobs.processIndividualWebhookJob,
}

export function startWebhooksWorker() {
  return createWorker(Queues.webhooksQueue, jobMappings, {
    concurrency: 50,
    connection: WORKER_CONNECTION_CONFIG,
  })
}
