export function thaiDayToUtc(date: string) {
  const startUtc = new Date(`${date}T00:00:00+07:00`);
  const endUtc = new Date(`${date}T23:59:59+07:00`);
  return { startUtc, endUtc };
}