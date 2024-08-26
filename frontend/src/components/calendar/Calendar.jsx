import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import PopUp from "../layout/PopUp";
import Tooltip from "../layout/tooltip";
import { CalendarContext } from "../../App";
import { generateCalendarArray } from "../util/util";
import '../../style/Calendar.css'; 

dayjs.extend(utc);
dayjs.extend(timezone);

const Calendar = ({ monthIndex, year, changeCalender }) => {
  const [showPopUpType, setShowPopUpType] = useState({
    type: null,
    date: null,
    time: null,
  });

  const { CalendarData, reScheduleCalendar, publicHoliday } =
    useContext(CalendarContext);

  const [dragItem, setDragItem] = useState({
    id: "",
    title: "",
    date: "",
    time: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  const allDays = generateCalendarArray(monthIndex, year);

  const handleOnDrag = (e, data) => {
    const { _id, date, description, duration, time, title } = data;
    setDragItem({ id: _id, date, description, duration, time, title });
  };

  function handleOnDrop(e, date) {
    if (dayjs(date).diff(dayjs(), "days") >= 0) {
      reScheduleCalendar(dragItem.id, date, dragItem.time);
    }
  }

  function handleDragOver(e, date) {
    e.preventDefault();
  }

  const handleClick = (monthIndex, weekDays) => {
    console.log(monthIndex, weekDays);
    if (monthIndex !== dayjs(weekDays).month()) {
      monthIndex > dayjs(weekDays).month()
        ? changeCalender("prev")
        : changeCalender("next");
    } else if (dayjs(weekDays).diff(dayjs(), "days") >= 0) {
      setShowPopUpType({
        type: "Task",
        date: dayjs(weekDays).format("YYYY-MM-DD"),
        time: "",
      });
    }
  };

  return (
    <>
      <div className="calendar-container">
        <div className="weekday-headers">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((week, id) => (
            <div className="weekday-header" key={id}>
              {week}
            </div>
          ))}
        </div>
        {allDays.map((weeks, id) => (
          <div className="flex flex-1 justify-evenly" key={id}>
            {weeks.map((weekDays, id) => {
              const holiday = publicHoliday.filter(
                (e) => e.date.iso === weekDays
              );
              const date = dayjs(weekDays).date();
              const month = dayjs(weekDays).format("MMM");
              let schedulData = CalendarData.filter(
                (e) => e.date === dayjs(weekDays).format("YYYY-MM-DD")
              );
              return (
                <button
                  className={`calendar-day ${
                    dayjs(weekDays).diff(dayjs(), "days") < 0 ? 'bg-gray-100' : ''
                  } ${
                    monthIndex !== dayjs(weekDays).month() ? 'opacity-70' : ''
                  } ${
                    dayjs(weekDays).format("YYYY-MM-DD") ===
                      dayjs().format("YYYY-MM-DD") ? 'today' : ''
                  }`}
                  key={id}
                  onClick={() => handleClick(monthIndex, weekDays)}
                  onDrop={(e) => handleOnDrop(e, weekDays)}
                  onDragOver={(e) => handleDragOver(e, date)}
                >
                  {date === 1 ? `${month} ${date}` : date}
                  {holiday.length > 0 &&
                    holiday.map((curr, id) => (
                      <div className="holiday" key={id}>
                        <span className="holiday-name">{curr.name}</span>
                      </div>
                    ))}
                  <div className="schedule-data">
                    {schedulData.map((curr, id) => {
                      const colorMap = {
                        Task: "#f5265a",
                        Meeting: "#33ca2f",
                        Calling: "#5abbf0",
                      };
                      const color = colorMap[curr.type];
                      return (
                        <div className="schedule-data-item" key={id}>
                          <span
                            className="schedule-data-item-title"
                            style={{ backgroundColor: color }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setIsVisible(curr._id);
                            }}
                            draggable={
                              dayjs(weekDays).diff(dayjs(), "days") >= 0
                            }
                            onDragStart={(e) => handleOnDrag(e, curr)}
                          >
                            {curr.title}
                          </span>
                          <Tooltip
                            isVisible={isVisible}
                            setIsVisible={setIsVisible}
                            found={curr}
                            setShowPopUpType={setShowPopUpType}
                            color={color}
                          />
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {showPopUpType?.type && (
        <PopUp
          showPopUpType={showPopUpType.type}
          setShowPopUpType={setShowPopUpType}
          {...showPopUpType}
        />
      )}
    </>
  );
};

export default Calendar;
