import React, { useContext, useEffect, useRef, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { RiArrowDropDownLine } from "react-icons/ri";
import DatePicker from "./SideMenu/DatePicker";
import axios from "axios";
import { CalendarContext } from "../../App";
import "../../style/PopUp.css";
import dayjs from "dayjs";

const durations = [
  { minutes: 15, text: "15 minutes" },
  { minutes: 30, text: "30 minutes" },
  { minutes: 60, text: "1 hour" },
  { minutes: 90, text: "1.30 hours" },
  { minutes: 120, text: "2 hours" },
  { minutes: 150, text: "2.30 hours" },
  { minutes: 180, text: "3 hours" },
  { minutes: 210, text: "3.30 hours" },
  { minutes: 240, text: "4 hours" },
  { minutes: 270, text: "4.30 hours" },
  { minutes: 300, text: "5 hours" },
];

const PopUp = ({
  showPopUpType = "Task",
  setShowPopUpType,
  date,
  time,
  title = "",
  description = "",
  duration,
  _id = null,
}) => {
  const [datePicker, setDatePicker] = useState(false);
  const [fullDate, setFullDate] = useState(dayjs());
  const [isOpen, setIsOpen] = useState(false);

  const [inputData, setInputData] = useState({
    type: showPopUpType,
    title,
    description,
    duration,
    date: date,
    time: time,
  });

  const { updateCalendar } = useContext(CalendarContext);

  const ref2 = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref2.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref2]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (_id) {
      updateCalendar(_id, inputData);
      setShowPopUpType(null);
    } else {
      await axios
        .post("/api/schedule", inputData)
        .then((response) => {
          console.log(response.data);
          setShowPopUpType(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <TfiClose
          className="close-icon"
          onClick={() => setShowPopUpType(null)}
        />
        <form onSubmit={onSubmit} className="form">
          <div className="button-group">
            {["Task", "Calling", "Meeting"].map((btn, id, arr) => (
              <button
                type="button"
                key={id}
                className={inputData.type === btn ? "active" : ""}
                onClick={() => setInputData({ ...inputData, type: btn })}
              >
                {btn}
              </button>
            ))}
          </div>
          <input
            type="text"
            id="title"
            name="title"
            value={inputData.title}
            className="input-field"
            placeholder="Title"
            onChange={handleInput}
            required
          />

          <div className="relative-container" ref={ref}>
            <div
              className="input-group"
              onClick={() => setDatePicker(!datePicker)}
            >
              <span>📅</span>
              <input
                type="text"
                id="ReminderTime"
                className="input-field"
                placeholder="Select Reminder time"
                onChange={() => {}}
                value={`${inputData.date} | ${inputData.time}`}
                required
              />
            </div>
            <div ref={ref2} className="dropdown">
              <button onClick={() => setIsOpen(!isOpen)} type="button">
                {inputData.duration
                  ? durations.find((e) => e.minutes === inputData.duration).text
                  : "Select Duration"}{" "}
                <RiArrowDropDownLine className="dropdown-icon" />
              </button>

              {isOpen && (
                <div className="dropdown-content">
                  <ul>
                    {durations.map((curr, id) => (
                      <li
                        className={
                          curr.minutes === inputData.duration ? "selected" : ""
                        }
                        key={id}
                        onClick={() => {
                          setInputData({
                            ...inputData,
                            duration: curr.minutes,
                          });
                          setIsOpen(false);
                        }}
                      >
                        {curr.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {datePicker && (
              <DatePicker
                inputData={inputData}
                setInputData={setInputData}
                date={date}
                time={time}
                fullDate={fullDate}
                setFullDate={setFullDate}
                setDatePicker={setDatePicker}
              />
            )}
          </div>
          <textarea
            name="description"
            value={inputData.description}
            onChange={handleInput}
            id="description"
            placeholder="Description"
            className="textarea-field"
          ></textarea>
          <div className="submit-container">
            <button type="submit" className="submit-button">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
