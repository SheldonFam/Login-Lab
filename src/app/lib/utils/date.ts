/**
 * Date and time utility functions
 */

/**
 * Formats a date to a readable string with 12-hour format
 * Format: YYYY-MM-DD HH:MM:SS AM/PM
 */
export function formatDateTime(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // the hour '0' should be '12'

  const formattedTime = `${String(hours).padStart(
    2,
    "0"
  )}:${minutes}:${seconds} ${ampm}`;
  return `${year}-${month}-${day} ${formattedTime}`;
}
