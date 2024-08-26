import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import React, { useContext, useEffect, useState } from "react";
import { PiCaretRightLight, PiCaretLeftLight } from "react-icons/pi";
import PopUp from "../layout/PopUp";
import { CalendarContext } from "../../App";
import Tooltip from "../layout/tooltip";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const WeeklyCalendar = ({ setDate }) => {
  const [weeks, setWeeks] = useState(null);
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [currStartWeek, setCurrStartWeek] = useState(() => {
    // console.log(dayjs(new Date(2024,7,26)).tz("Asia/Kolkata").weekday());
    return dayjs().tz("Asia/Kolkata").weekday() !== 1
      ? dayjs().tz("Asia/Kolkata").weekday(-6).startOf("day")
      : dayjs().tz("Asia/Kolkata").weekday(1).startOf("day");
  });
  const { CalendarData, reScheduleCalendar, publicHoliday } =
    useContext(CalendarContext);
  const [currDateTime] = useState(dayjs().format("YYYY-MM-DD|h A|mm"));
  const [showPopUpType, setShowPopUpType] = useState({
    type: null,
    date: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  const [dragItem, setDragItem] = useState({
    title: "",
    date: "",
    time: null,
  });

  function generateTimeArray(startTime, endTime, intervalMinutes) {
    let times = [];
    let currentTime = dayjs(startTime);

    while (
      currentTime.isBefore(dayjs(endTime)) ||
      currentTime.isSame(dayjs(endTime))
    ) {
      times.push(currentTime.format("h A"));
      currentTime = currentTime.add(intervalMinutes, "minute");
    }
    // console.log(times)
    return times;
  }

  const startTime = dayjs().hour(1).minute(0);
  const endTime = dayjs().hour(24).minute(0);
  useEffect(() => {
    setTimeIntervals(generateTimeArray(startTime, endTime, 60));
  }, []);

  useEffect(() => {
    const scrollElement = document.querySelector(".overflow-y-scroll");
    const now = dayjs();
    const minutes = now.minute();
    const interval = Math.floor(minutes / 60) * 30;
    const formattedTime = now.set("minute", interval).format("h A");
    const position = timeIntervals?.findIndex((time) => time === formattedTime);
    scrollElement.scrollTop = position * 100;
  }, [timeIntervals]);

  const changeCalender = (direction) => {
    if (direction === "prev") {
      setCurrStartWeek(dayjs(currStartWeek).startOf("week").weekday(-6));
    } else {
      setCurrStartWeek(dayjs(currStartWeek).startOf("week").weekday(+8));
    }
  };

  useEffect(() => {
    setDate(currStartWeek);
  }, [currStartWeek]);

  const spannedColumns = {};

  useEffect(() => {
    const endOfWeek = currStartWeek.add(6, "day");
    // console.log(currStartWeek.format("DD-MM"));

    let dates = [];
    let currentDate = currStartWeek;

    while (currentDate <= endOfWeek) {
      dates.push({
        date: currentDate.format("YYYY-MM-DD"),
        week: currentDate.format("ddd"),
      });
      currentDate = currentDate.add(1, "day");
    }
    setWeeks(dates);
  }, [currStartWeek]);

  const handleOnDrag = (e, data) => {
    // console.log(data)
    const { _id, date, description, duration, time, title } = data;
    setDragItem({ id: _id, date, description, duration, time, title });
  };

  function handleOnDrop(date, time) {
    reScheduleCalendar(dragItem.id, date, time);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  const handleClick = (weekDays, id = null) => {
    // console.log("CLick", weekDays,id);
    if (id) {
      setIsVisible(id);
    } else {
      setShowPopUpType({
        type: "Task",
        date: dayjs(weekDays).format("YYYY-MM-DD"),
      });
    }
  };
  return (
    <div className="flex flex-col justify-stretch flex-1 px-8 pr-4 pt-8 pb-16 h-[800px] ">
      <div className="flex text-2xl gap-4 justify-end items-center my-4">
        <h1 className="text-lg font-bold">
          {currStartWeek.format("DD")}-
          {currStartWeek.add(6, "day").format("DD")}{" "}
          {currStartWeek.format("MMMM YYYY")}
        </h1>
        <div className="flex gap-10 text-gray-600">
          <PiCaretLeftLight
            className="cursor-pointer "
            onClick={() => changeCalender("prev")}
          />
          <PiCaretRightLight
            className="cursor-pointer "
            onClick={() => changeCalender("next")}
          />
        </div>
      </div>

      <div className="overflow-y-scroll overflow-x-hidden">
        <table className="">
          <thead className="border-b-2 sticky top-0 bg-white z-30">
            <tr>
              <th className="w-20 border-r-2"></th>
              {weeks?.map((week, index) => {
                const holiday = publicHoliday.find(
                  (e) => e.date.iso === week.date
                );

                let curr = dayjs().format("YYYY-MM-DD") === week.date;
                return (
                  <th key={index} className=" border-l-2 text-gray-700 py-4">
                    <div className="flex flex-col justify-center items-center">
                      <p
                        className={`text-base font-bold ${
                          curr && "text-[#1967d2]"
                        }`}
                      >
                        {week.week.toUpperCase()}
                      </p>
                      <p
                        className={`text-2xl p-2 aspect-square flex justify-center items-center font-bold rounded-full ${
                          curr && "bg-[#1967d2] text-white"
                        }`}
                      >
                        {dayjs(week.date).format("DD")}
                      </p>
                      {holiday && (
                        <div
                          className={`w-full relative flex flex-col gap-2 mt-4`}
                        >
                          <span
                            className={`rounded break-words text-sm mb-1 bg-yellow-300 text-red-500 font-bold`}
                          >
                            {holiday.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white">
            {timeIntervals?.map((curr, rowIndex) => {
              const [date, currTime, minute] = currDateTime.split("|");
              let alreadyIncluded = [];
              return (
                <tr key={rowIndex} className="relative row-line">
                  <td className="absolute top-[-8px] w-20">
                    <p className="text-xs z-10 ">{curr}</p>
                  </td>

                  {weeks?.map((week, colIndex) => {
                    let found = false;
                    let time = dayjs(curr, "h A").format("HH:mm");
                    let d1 = dayjs(`${week.date} ${time}`);
                    let tempDuration = 0;
                    let rowSpan = 1;

                    found = CalendarData.filter((e) => {
                      let d2 = dayjs(`${e.date} ${e.time}`);
                      if (
                        (d2.isSame(d1) ||
                          d2.isBetween(
                            d1.subtract(0, "minute"),
                            d1.add(60 * rowSpan, "minute")
                          )) &&
                        !alreadyIncluded.find((find) => find === e._id)
                      ) {
                        tempDuration += e.duration;
                        tempDuration > 60
                          ? (rowSpan = Math.ceil(tempDuration / 60))
                          : 1;
                        alreadyIncluded.push(e._id);
                        return true;
                      }
                    });
                    let dur = found.reduce(
                      (acc, curr) => acc + curr.duration,
                      0
                    );
                    rowSpan = found.length > 0 ? Math.ceil(dur / 60) : 1;

                    if (
                      !spannedColumns[colIndex] ||
                      spannedColumns[colIndex] === 0
                    ) {
                      if (rowSpan > 1) spannedColumns[colIndex] = rowSpan - 1;
                      return (
                        <td
                          key={colIndex}
                          rowSpan={rowSpan}
                          className={`cursor-pointer w-[13.5%] p-[2px] h-28 delay-100 text-white border-l-2 flex-1 relative  rounded-lg  
                          ${
                            !found.length > 0 &&
                            "hover:bg-[#0997e458] hover:text-white"
                          } ${found.find((e) => e._id !== isVisible) && "z-[1]"}
                          `}
                          onClick={() => handleClick(week.date)}
                        >
                          <div
                            className="flex flex-col gap-[0.5px] items-start left-[0px] right-[.4px] absolute top-0 h-[99%] w-[100%]"
                            onDrop={() => {
                              handleOnDrop(d1.format("YYYY-MM-DD"), time);
                            }}
                            onDragOver={handleDragOver}
                          >
                            {found.map((schedule, id) => {
                              const colorMap = {
                                Task: "#f5265a",
                                Meeting: "#33ca2f",
                                Calling: "#5abbf0",
                              };
                              const marginTop =
                                (dayjs(schedule.time, "HH:mm").diff(
                                  dayjs(time, "HH:mm"),
                                  "minute"
                                ) /
                                  60) *
                                100;
                              const color = colorMap[schedule?.type] || null;

                              let percent =
                                dur === schedule.duration
                                  ? (schedule.duration / (60 * rowSpan)) * 100
                                  : (schedule.duration / dur) * 100;

                              let scheduleTime = dayjs(
                                `${schedule?.date} ${schedule?.time}`
                              );
                              return (
                                <React.Fragment key={id}>
                                  <div
                                    style={{
                                      height: marginTop
                                        ? `calc(${marginTop}% `
                                        : "0px",
                                    }}
                                  ></div>
                                  <div
                                    className={`p-2 rounded w-full`}
                                    draggable={!!schedule}
                                    onDragStart={(e) =>
                                      found && handleOnDrag(e, schedule)
                                    }
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleClick(week.date, schedule?._id);
                                    }}
                                    style={{
                                      backgroundColor: color,
                                      height: `calc(${percent}%)`,
                                    }}
                                  >
                                    {found && (
                                      <>
                                        <p className="text-sm font-semibold truncate">
                                          {schedule?.title}
                                        </p>
                                        <p className="text-xs tracking-wide  truncate">
                                          {scheduleTime &&
                                            `${scheduleTime.format(
                                              "hh:mm"
                                            )} - ${scheduleTime
                                              .add(
                                                schedule?.duration,
                                                "minutes"
                                              )
                                              .format("hh:mm A")}`}
                                        </p>
                                      </>
                                    )}
                                    <Tooltip
                                      isVisible={isVisible}
                                      setIsVisible={setIsVisible}
                                      found={schedule}
                                      setShowPopUpType={setShowPopUpType}
                                      color={color}
                                      position={colIndex < 3 ? "right" : "left"}
                                    />
                                  </div>
                                </React.Fragment>
                              );
                            })}
                            {currTime === curr && week.date === date && (
                              <div
                                className={`absolute w-[120%] ml-[-15%]`}
                                style={{
                                  top: `${Math.floor((minute / 60) * 100)}%`,
                                }}
                              >
                                <div className="h-[2px] bg-red-700 relative ">
                                  <div className="w-3 aspect-square rounded-full bg-inherit absolute top-[-5px] "></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    } else {
                      spannedColumns[colIndex] -= 1;
                      return null;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

export default WeeklyCalendar;
