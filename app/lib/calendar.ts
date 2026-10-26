export function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function dateRangeError(from: string, to: string) {
  if ((from && !isCalendarDate(from)) || (to && !isCalendarDate(to)))
    return "Enter valid dates in YYYY-MM-DD format.";
  if (from && to && from > to)
    return "From date must be on or before Through date.";
  return "";
}
export function facilityToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((key) => parts.find((part) => part.type === key)!.value)
    .join("-");
}
