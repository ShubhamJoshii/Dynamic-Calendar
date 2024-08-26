import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";

import React, { useContext, useEffect, useState } from "react";
import { PiCaretRightLight, PiCaretLeftLight } from "react-icons/pi";
import PopUp from "../layout/PopUp";
import { CalendarContext } from "../../App";
import Tooltip from "../layout/tooltip";
import "../../style/DailyCalendar.css";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);

function generateTimeArray(startTime, endTime, intervalMinutes) {
  let times = [];
  let currentTime = dayjs(startTime);

  while (
    currentTime.isBefore(dayjs(endTime)) ||
    currentTime.isSame(dayjs(endTime))
  ) {
    times.push(currentTime.format("hh:mm A"));
    currentTime = currentTime.add(intervalMinutes, "minute");
  }
  return times;
}

const DailyCalendar = () => {
  const [week, setWeek] = useState(null);
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [showPopUpType, setShowPopUpType] = useState({
    type: null,
    date: null,
    time: null,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [holiday, setHoliday] = useState([]);
  const { CalendarData, reScheduleCalendar, publicHoliday } =
    useContext(CalendarContext);

  const [dragItem, setDragItem] = useState({
    title: "",
    date: "",
    time: "",
  });

  const [currentDate, setCurrentDate] = useState(dayjs());

  const startTime = dayjs().hour(1).minute(0);
  const endTime = dayjs().hour(24).minute(0);

  useEffect(() => {
    setTimeIntervals(generateTimeArray(startTime, endTime, 30));
  }, []);

  useEffect(() => {
    const scrollElement = document.querySelector(".table-container");
    const now = dayjs();
    const minutes = now.minute();
    const interval = Math.floor(minutes / 30) * 30;
    const formattedTime = now.set("minute", interval).format("hh:mm A");
    const position = timeIntervals.findIndex((time) => time === formattedTime);
    scrollElement.scrollTop = position * 90;
  }, [timeIntervals]);

  const handleOnDrag = (e, data) => {
    const { _id, date, description, duration, time, title } = data;
    setDragItem({ id: _id, date, description, duration, time, title });
  };

  function handleOnDrop(date, time) {
    reScheduleCalendar(dragItem.id, date, time);
  }

  function handleDragOver(e, date) {
    e.preventDefault();
  }

  const changeCalender = (direction) => {
    if (direction === "prev") {
      setCurrentDate(currentDate.subtract(1, "day"));
    } else {
      setCurrentDate(currentDate.add(1, "day"));
    }
  };

  const handleClick = (weekDays, time, id = null) => {
    if (id) {
      setIsVisible(id);
    } else {
      setShowPopUpType({
        type: "Task",
        date: dayjs(weekDays).format("YYYY-MM-DD"),
        time,
      });
    }
  };

  useEffect(() => {
    const holidayTemp = publicHoliday.filter(
      (e) => e.date.iso === currentDate.format("YYYY-MM-DD")
    );
    setHoliday(holidayTemp);
  }, [currentDate, publicHoliday]);

  return (
    <div className="calendar-container">
      <div className="header">
        <h1 className="header-title">
          {currentDate.format("DD MMMM YYYY")}
          {holiday.length > 0 && (
            <div className="holiday">
              <span className="holiday-text">Holiday:</span>
              <div className="holiday-list">
                {holiday?.map((curr, id) => {
                  return (
                    <div className="holiday-item" key={id}>
                      <span className="holiday-item-text">{curr.name},</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </h1>
        <div className="nav-arrows">
          <PiCaretLeftLight
            className="nav-arrow"
            onClick={() => changeCalender("prev")}
          />
          <PiCaretRightLight
            className="nav-arrow"
            onClick={() => changeCalender("next")}
          />
        </div>
      </div>
      <table className="table-container">
        <tbody>
          {timeIntervals.map((curr, id) => {
            const time = dayjs(curr, "hh:mm A").format("HH:mm");
            const currTime = dayjs();
            let minute = dayjs().format("mm");
            let minutes = currTime.minute();
            let roundedMinutes = Math.floor(minutes / 30) * 30;
            let roundedTime = currTime
              .set("minute", roundedMinutes)
              .set("second", 0);

            minute = minute > 30 ? minute - 30 : minute;
            const showTimeLine =
              roundedTime.format("HH") === time.split(":")[0] &&
              roundedTime.format("mm") === time.split(":")[1] &&
              roundedTime.format("YYYY-MM-DD") ===
                currentDate.format("YYYY-MM-DD");

            let d1 = dayjs(`${currentDate.format("YYYY-MM-DD")} ${time}`);
            let schedule = CalendarData.find((e) => {
              let d2 = dayjs(`${e.date} ${e.time}`);
              if (d1.isSame(d2)) return true;
            });
            const colorMap = {
              Task: "#f5265a",
              Meeting: "#33ca2f",
              Calling: "#5abbf0",
            };
            const color = colorMap[schedule?.type] || null;
            let scheduleTime = dayjs(`${schedule?.date} ${schedule?.time}`);
            return (
              <tr
                className="table-row"
                key={id}
                onDrop={() => handleOnDrop(d1.format("YYYY-MM-DD"), time)}
                onDragOver={handleDragOver}
              >
                <td className="time-column">
                  <p className="time-text">{curr}</p>
                </td>
                <td className="separator"></td>
                <td
                  className="schedule-cell"
                  draggable={!!schedule}
                  onDragStart={(e) => schedule && handleOnDrag(e, schedule)}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    handleClick(
                      currentDate.format("YYYY-MM-DD"),
                      time,
                      schedule?._id
                    )
                  }
                >
                  {schedule && (
                    <>
                      <p className="schedule-title">{schedule?.title}</p>
                      <p className="schedule-time">
                        {scheduleTime &&
                          `${scheduleTime.format("hh:mm")} - ${scheduleTime
                            .add(schedule?.duration, "minutes")
                            .format("hh:mm A")}`}
                      </p>
                    </>
                  )}
                  {showTimeLine && (
                    <div
                      className="time-line"
                      style={{
                        "--minute": minute,
                      }}
                    >
                      <div className="time-line-bar">
                        <div className="time-line-dot"></div>
                      </div>
                    </div>
                  )}
                  <Tooltip
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    found={schedule}
                    setShowPopUpType={setShowPopUpType}
                    color={color}
                    position={"bottom"}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showPopUpType?.type && (
        <PopUp
          showPopUpType={showPopUpType.type}
          setShowPopUpType={setShowPopUpType}
          {...showPopUpType}
        />
      )}
    </div>
  );
};

export default DailyCalendar;
