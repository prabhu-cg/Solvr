import type { NewProjectInput } from '@/data/models'

/**
 * Fictional sample used to let people explore Solvr without typing a real
 * project first. No invented statistics or research findings — just a
 * plausible problem statement, matching the "no fake data" constraint.
 */
export const SAMPLE_PROJECT: NewProjectInput = {
  name: 'Council Parking Permit Application',
  problem:
    'Residents applying for a street parking permit have to print a form, attach paper proof of address, and post it to the council. Processing takes weeks, applicants get no status updates, and the council call centre spends significant time answering "where is my permit" calls.',
  productService:
    'An online service that lets residents apply for, renew and check the status of a street parking permit without visiting or calling the council.',
  targetUsers:
    'Residents who need a parking permit — including people applying for the first time, people renewing an existing permit, and people who are not confident using online government services.',
  businessGoal:
    'Reduce the cost and time of processing permit applications, cut avoidable contact to the call centre, and make the service accessible to residents regardless of their digital confidence.',
  constraints:
    'Must integrate with the council\'s existing address-verification system. Must meet public-sector accessibility requirements. Limited digital delivery budget for this financial year.',
  evidence:
    'Call centre notes indicate "permit status" is a frequently repeated query. Current paper form has a two-week average turnaround. No formal user research has been conducted yet.',
  isSample: true,
}
