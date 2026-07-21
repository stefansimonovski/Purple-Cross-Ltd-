import dayjs from 'dayjs'

/** Employment date display per Requirements. */
export function employmentStatus(date: string): string {
  return dayjs(date).isAfter(dayjs(), 'day') ? 'Employed soon' : 'Currently employed'
}

/** Termination date display per Requirements. */
export function terminationStatus(date: string | null): string {
  if (!date) return '—'
  return dayjs(date).isAfter(dayjs(), 'day') ? 'To be terminated' : 'Terminated'
}
