import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { CalendarContext } from "../../App";
import Tooltip from "../layout/tooltip";
import PopUp from "../layout/PopUp";
import '../../style/Schedule.css';  

const Schedule = () => {
  const { CalendarData } = useContext(CalendarContext);
  const [isVisible, setIsVisible] = useState(false);
  const [showPopUpType, setShowPopUpType] = useState({
    type: null,
    date: null,
  });

  const handleClick = (weekDays, id = null) => {
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
    <div className="schedule-container">
      <table className="schedule-table">
        <thead>
          <tr>
            <th className="date">DATE</th>
            <th className="month">MONTH</th>
            <th className="time">TIME</th>
            <th className="title">
              TITLE
            </th>
          </tr>
        </thead>
        <tbody>
          {CalendarData.map((curr, id) => {
            const date = dayjs(curr.date).format("D");
            const MonthAndDay = dayjs(curr.date)
              .format("MMM, ddd")
              .toUpperCase();
            const time = dayjs(`${curr.date} ${curr.time}`, "HH:mm:ss").format(
              "HH:mm"
            );
            const colorMap = {
              Task: "#f5265a",
              Meeting: "#33ca2f",
              Calling: "#5abbf0",
            };
            const color = colorMap[curr.type] || null;

            return (
              <tr key={id}>
                <td className="date">{date}</td>
                <td className="month">{MonthAndDay}</td>
                <td className="time">{time}</td>
                <td
                  className="title"
                  style={color ? { background: color } : {}}
                  onClick={() => handleClick(curr.date, curr?._id)}
                >
                  <p>{curr.title}</p>
                  <Tooltip
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    found={curr}
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

export default Schedule;
