export enum TaskStatus {
  UNDONE = 'UNDONE',
  DONE = 'DONE',
}

/**
 * Eisenhower Matrix Priority using bitmap:
 * - 0 (00): Not Urgent & Not Important
 * - 1 (01): Not Urgent & Important
 * - 2 (10): Urgent & Not Important
 * - 3 (11): Urgent & Important
 */
export enum TaskPriority {
  NOT_URGENT_NOT_IMPORTANT = 0,
  NOT_URGENT_IMPORTANT = 1,
  URGENT_NOT_IMPORTANT = 2,
  URGENT_IMPORTANT = 3,
}
