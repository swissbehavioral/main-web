import test from "node:test";
import assert from "node:assert/strict";
import {
  isCalendarDate,
  dateRangeError,
  facilityToday,
} from "../app/lib/calendar.ts";
import { filterLeads } from "../app/lib/lead-filters.ts";
test("Calendar validates real dates, leap years and reversed ranges", () => {
  assert(isCalendarDate("2028-02-29"));
  assert(!isCalendarDate("2026-02-29"));
  assert(!isCalendarDate("2026-13-01"));
  assert(!isCalendarDate("10/25/2026"));
  assert.equal(dateRangeError("2026-10-01", "2026-10-25"), "");
  assert(dateRangeError("2026-10-25", "2026-10-01"));
  assert(dateRangeError("2026-02-30", ""));
  assert.equal(dateRangeError("", ""), "");
});
test("Calendar Today follows the facility date, regardless of browser time zone", () => {
  assert.equal(facilityToday(new Date("2026-10-25T02:00:00Z")), "2026-10-24");
});
test("Invalid date filters return no records instead of silently broadening exports", () => {
  const lead = {
    id: "test",
    name: "Synthetic",
    kind: "inquiry",
    status: "new",
    createdAt: "2026-10-25T12:00:00Z",
  };
  assert.deepEqual(filterLeads([lead], new URLSearchParams("from=bad")), []);
  assert.deepEqual(
    filterLeads([lead], new URLSearchParams("from=2026-10-26&to=2026-10-24")),
    [],
  );
  assert.equal(
    filterLeads([lead], new URLSearchParams("from=2026-10-25&to=2026-10-25"))
      .length,
    1,
  );
});
