import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PiCaretLeftLight, PiCaretRightLight } from "react-icons/pi";
import { generateCalendarArray } from "../../util/util";
import { CalendarContext } from "../../../App";
import axios from "axios";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const SideCalendar = ({ setDate, CalendarData }) => {
  const [fullDate, setFullDate] = useState(dayjs().tz("Asia/Kolkata"));
  const year = fullDate.year();
  const monthIndex = fullDate.month();
  const [publicHoliday, setPublicHoliday] = useState([]);

  let allDays = generateCalendarArray(monthIndex, year);

  const fetchHolidays = async (year, month) => {
    await axios(
      `https://calendarific.com/api/v2/holidays?api_key=5Erv3UFqRquyzbt0FgkLfvBm1qC84s6E&country=IN&year=${year}`
    )
      .then((response) => {
        let holidays = response.data.response.holidays.filter((curr) => {
          const holidayDate = dayjs(curr.date.iso);
          return holidayDate.month() === month - 1;
        });
        console.log(holidays);
        setPublicHoliday(holidays);
      })
      .catch((err) => {
        console.error("Error fetching holidays:", err);
        return [];
      });
  };

  useEffect(() => {
    fetchHolidays(fullDate.year(), fullDate.month() + 1);
  }, [fullDate]);

  const changeCalender = (direction) => {
    if (direction === "prev") {
      setFullDate(
        dayjs(new Date(fullDate.year(), fullDate.month() - 1, fullDate.date()))
      );
    } else {
      setFullDate(
        dayjs(new Date(fullDate.year(), fullDate.month() + 1, fullDate.date()))
      );
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-semibold">
          {fullDate.format("MMMM YYYY")}
        </h1>
        <div className="flex text-2xl gap-4 text-black">
          <PiCaretLeftLight onClick={() => changeCalender("prev")} />
          <PiCaretRightLight onClick={() => changeCalender("next")} />
        </div>
      </div>
      <div className="flex flex-col justify-stretch flex-1">
        <div className="flex justify-evenly flex-1 mb-1">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((week, id) => {
            return (
              <div className="flex-1 text-center p-2 font-semibold" key={id}>
                {week}
              </div>
            );
          })}
        </div>
        {allDays.map((weeks, id) => {
          return (
            <div className="flex justify-evenly flex-1 gap-1 mb-1" key={id}>
              {weeks.map((weekDays, id) => {
                // console.log(weekDays)
                const holiday = publicHoliday.filter(
                  (e) => e.date.iso === weekDays
                );
                // holiday.length > 0 && console.log(holiday);

                const date = dayjs(weekDays).date();
                const month = dayjs(weekDays).format("MMM");
                let schedulData = CalendarData.find(
                  (e) => e.date === dayjs(weekDays).format("YYYY-MM-DD")
                );

                const colorMap = {
                  Task: "#f5265a",
                  Meeting: "#33ca2f",
                  Calling: "#5abbf0",
                };

                const color =
                  holiday.length > 0
                    ? "yellow"
                    : colorMap[schedulData?.type] || null;
                return (
                  <div
                    className={`flex-1 aspect-square flex justify-center items-center hover:bg-gray-200 cursor-pointer ${
                      monthIndex !== dayjs(weekDays).month() && "opacity-70"
                    }  
                      ${
                        dayjs().tz("Asia/Kolkata").format("YY-MM-DD") ===
                          dayjs(weekDays).format("YY-MM-DD") &&
                        "bg-[#419dff81] p-1 rounded-t-full hover:!bg-[#419dff81]"
                      } 
                      ${
                        (dayjs(weekDays).day() == 0 ||
                          dayjs(weekDays).day() == 6) &&
                        "font-bold"
                      } 
                      ${
                        holiday.length > 0 && "!border-b-yellow-300 !border-b-2"
                      }   
                      `}
                    style={color && { borderBottom: `3px solid ${color}` }}
                    key={id}
                    onClick={() =>
                      setDate(
                        dayjs(
                          new Date(
                            fullDate.year(),
                            fullDate.month(),
                            fullDate.date()
                          )
                        )
                      )
                    }
                  >
                    {date}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideCalendar;
