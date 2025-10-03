export function isSameDayBookingClosed(stayDate, cutoffHour = 17) {
  const date = new Date(stayDate);
  if (isNaN(date.getTime())) return false; // invalid date, let controller handle

  // Convert to IST
  const istOffset = 5.5 * 60; // minutes
  const dateIST = new Date(date.getTime() + istOffset * 60 * 1000);
  const nowIST = new Date(Date.now() + istOffset * 60 * 1000);

  const isSameDay =
    dateIST.getUTCFullYear() === nowIST.getUTCFullYear() &&
    dateIST.getUTCMonth() === nowIST.getUTCMonth() &&
    dateIST.getUTCDate() === nowIST.getUTCDate();

  const isAfterCutoff = nowIST.getUTCHours() >= cutoffHour;

  return isSameDay && isAfterCutoff;
}
