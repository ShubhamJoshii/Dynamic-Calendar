import React, { useContext, useEffect, useRef, useState } from "react";

import SideCalendar from "./SideCalendar";
import { RxDotsHorizontal } from "react-icons/rx";

import { RiArrowDropDownLine } from "react-icons/ri";
import PopUp from "../PopUp";
import { CalendarContext } from "../../../App";

const dropdownMenu = ["Task", "Meeting", "Calling"];

const MyCalendar = [
  {
    text: "Task",
    color: "#f5265a",
  },
  {
    text: "Meeting",
    color: "#33ca2f",
  },
  {
    text: "Calling",
    color: "#0999e4",
  },
];

const users = ["Artem Ivushkin", "Shubham Joshi"];

const SideMenu = ({ setDate, type, setType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopUpType, setShowPopUpType] = useState(null);
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [selected,setSelected] = useState("Artem Ivushkin")
  const { CalendarData } = useContext(CalendarContext);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const ref = useRef(null);
  const ref2 = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
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
        setIsOpenDrop(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref2]);

  return (
    <div className="w-[400px] p-8">
      <div className="relative inline-block text-left w-48 z-10" ref={ref}>
        <div className="">
          <button
            type="button"
            className="inline-flex justify-between border rounded-full border-gray-900 shadow-sm px-8 py-4 bg-white text-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={toggleDropdown}
          >
            Options
          </button>
        </div>

        {isOpen && (
          <div
            className="origin-top-right absolute right-0 w-full mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              {dropdownMenu.map((curr, id) => {
                return (
                  <div
                    key={id}
                    className="text-gray-700 block pl-4 py-2 pr-12 text-lg font-medium cursor-pointer hover:text-[#58abd8] hover:bg-[#58abd821]"
                    onClick={() => setShowPopUpType(curr)}
                  >
                    {curr}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <SideCalendar setDate={setDate} CalendarData={CalendarData} />

      <div ref={ref2} className="relative inline-block text-left w-full my-8">
        <button
          onClick={() => setIsOpenDrop(!isOpenDrop)}
          className="hover:text-white w-full border hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between "
          type="button"
        >
          {selected ? selected : "Select User"}{" "}
          <RiArrowDropDownLine className="text-4xl" />
        </button>

        {isOpenDrop && (
          <div className="z-10 absolute right-0 mt-2 bg-white divide-y  w-full divide-gray-100 rounded-lg shadow">
            <ul
              className="py-2 text-sm text-gray-700 rounded-lg "
              aria-labelledby="dropdownDefaultButton"
            >
              {users.map((curr, id) => {
                // let selected = curr.minutes === inputData.duration;
                // console.log(selected)
                return (
                  <li
                    className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selected === curr && "!bg-[#0999e4] text-white font-bold"
                    }`}
                    key={id}
                    onClick={() => {
                      console.log("CLikc")
                      setSelected(curr);
                      setIsOpenDrop(false);
                    }}
                  >
                    {curr}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold my-6">My Calendars</h1>
        <ul>
          {MyCalendar.map((curr, id) => {
            return (
              <li className="flex items-center justify-between mb-4" key={id}>
                <div className="flex items-center flex-1">
                  <input
                    id={curr.text}
                    type="checkbox"
                    value={curr.text}
                    defaultChecked
                    // checked={type.find((e) => e === curr.text)}
                    onClick={(e) => {
                      // console.log(e.target.value,e.target.checked);
                      e.target.checked
                        ? setType([...type, e.target.value])
                        : setType(type.filter((e) => e !== curr.text));
                    }}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    style={{ accentColor: curr.color }}
                  />
                  <label
                    htmlFor={curr.text}
                    className={`ms-2 text-2xl font-medium flex-1 cursor-pointer`}
                    style={{ color: curr.color }}
                  >
                    {curr.text}
                  </label>
                </div>
                <RxDotsHorizontal />
              </li>
            );
          })}
        </ul>
      </div>
      {showPopUpType && (
        <PopUp
          showPopUpType={showPopUpType}
          setShowPopUpType={setShowPopUpType}
        />
      )}
    </div>
  );
};

export default SideMenu;
