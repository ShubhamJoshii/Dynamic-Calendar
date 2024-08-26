import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PiCaretLeftLight, PiCaretRightLight } from "react-icons/pi";

dayjs.extend(utc);
dayjs.extend(timezone);

const DatePicker = ({
  inputData,
  setInputData,
  date,
  time,
  fullDate,
  setFullDate,
  setDatePicker
}) => {
  const [currentDateTime] = useState({
    date,
    time,
  });

  const year = fullDate.year();
  const monthIndex = fullDate.month();
  const firstDayofMonth = dayjs(new Date(year, monthIndex, 1)).day();
  let dateTemp = 0 - firstDayofMonth;

  let allDays = new Array(5).fill([]).map(() => {
    return new Array(7).fill([]).map(() => {
      dateTemp++;
      return dayjs(new Date(year, monthIndex, dateTemp))
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD");
    });
  });

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

  // useEffect(() => {
  //   if (inputData.date) {
  //     setFullDate(dayjs(inputData.date));
  //   }
  // }, [inputData]);

  const nowDateTime = ()=>{
    const date = dayjs().format("YYYY-MM-DD");
    const time = dayjs().format('hh:mm')
    // console.log(date,time)
    setInputData({...inputData,date,time})
  }

  return (
    <div className="w-[320px] shadow-2xl py-2 absolute bg-white top-14">
      <div className="flex gap-[4px] p-4 border-b-[1px] ">
        <input
          type="date"
          name="date"
          id="date"
          min={dayjs().format('YYYY-MM-DD')}
          value={inputData.date}
          className="border p-2 w-full"
          onChange={(e) => {
            e.preventDefault();
            setInputData({ ...inputData, date: e.target.value });
          }}
          />
        <input
          type="time"
          name="time"
          id="time"
          value={inputData.time}
          className="border p-2 w-full"
          onChange={(e) => {
            e.preventDefault();
            setInputData({ ...inputData, time: e.target.value });
          }}
        />
      </div>
      <div className="flex justify-between items-center my-4 text-lg gap-4 font-semibold text-black px-6 ">
        <button
          type="button"
          className="disabled:opacity-40 font-extrabold"
          disabled={
            dayjs(new Date(fullDate.year(), fullDate.month() - 1, 30)).diff(currentDateTime.date) < 0
          }
          onClick={() => changeCalender("prev")}
        >
          <PiCaretLeftLight />
        </button>
        <h1>{fullDate.format("YYYY MMMM ")}</h1>
        <button
          type="button"
          disabled={
            dayjs(
              new Date(fullDate.year(), fullDate.month() + 1, fullDate.date())
            ).diff(currentDateTime.date) < 0
          }
          onClick={() => changeCalender("next")}
        >
          <PiCaretRightLight />
        </button>
      </div>
      <div className="flex flex-col justify-stretch flex-1 px-6">
        <div className="flex justify-evenly flex-1 mb-1 border-b-[1px] text-sm ">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((week,id) => {
            return (
              <div className="flex-1 text-center p-2 font-semibold" key={id}>{week}</div>
            );
          })}
        </div>
        {allDays.map((weeks, ids) => {
          return (
            <div className="flex justify-evenly flex-1 mb-1 text-sm" key={ids}>
              {weeks.map((weekDays, id) => {
                const date = dayjs(weekDays).date();
                return (
                  <button
                    type="button"
                    key={id}
                    className={`flex-1 h-8 w-8 rounded-full flex justify-center items-center hover:bg-gray-100 cursor-pointer font-medium text-[#000000b9] 
                      disabled:opacity-70
                      ${
                        inputData.date ===
                          dayjs(weekDays).format("YYYY-MM-DD") &&
                        "bg-[#58abd893] hover:bg-[#58abd893]"
                      } `}
                    onClick={() => {
                      setInputData({
                        ...inputData,
                        date: dayjs(new Date(weekDays)).format("YYYY-MM-DD"),
                      });
                    }}
                    disabled={
                      dayjs(weekDays).diff(dayjs().format("YYYY-MM-DD")) < 0 || monthIndex !== dayjs(weekDays).month()
                    }
                  >
                    {date}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="border-t-[1px] py-2 px-6 text-right text-sm">
        <button type="button" className="px-6 py-1 text-[#5abbf0] font-bold" onClick={nowDateTime}>
          Now
        </button>
        <button type="button" className="border px-6 py-1 font-bold" onClick={()=>setDatePicker(false)}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
