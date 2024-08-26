import React from "react";
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from "dayjs";
dayjs.extend(isoWeek);

export function generateCalendarArray(month, year) {
  const startOfMonth = dayjs(new Date(year, month, 1));
  const endOfMonth = startOfMonth.endOf("month");

  let currentDay = startOfMonth.startOf("isoWeek");
  const calendar = [];
  while (
    currentDay.isBefore(endOfMonth) ||
    currentDay.isSame(endOfMonth, "day")
  ) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay.format("YYYY-MM-DD"));
      currentDay = currentDay.add(1, "day");
    }
    calendar.push(week);
  }
  return calendar;
}
