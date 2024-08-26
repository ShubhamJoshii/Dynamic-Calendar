import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import {
  PiCaretRightLight,
  PiCaretLeftLight,
  PiCaretDownLight,
} from "react-icons/pi";
import { NavLink, useLocation } from "react-router-dom";
import "../../style/Header.css"
const dropdownMenu = [
  {
    text: "Day",
    URL: "/day",
  },
  {
    text: "Week",
    URL: "/week",
  },
  {
    text: "Month",
    URL: "/month",
  },
  {
    text: "Schedule",
    URL: "/schedule",
  },
];

const Header = ({ date, setDate, changeCalender }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState("Month");
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();

  useEffect(() => {
    let text =
      location.pathname.charAt(1).toUpperCase() + location.pathname.slice(2);
    if (location.pathname === "/") {
      setSelectedCalendar("Month");
    } else {
      setSelectedCalendar(text);
    }
  }, [location]);

  const ref = useRef(null);
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

  return (
    <div className="header-container">
      <div className="header-left">
        <button
          type="button"
          className="today-button"
          onClick={() => setDate(dayjs().tz("Asia/Kolkata"))}
        >
          Today
        </button>
        <div className="navigation-icons">
          <PiCaretLeftLight onClick={() => changeCalender("prev")} />
          <PiCaretRightLight onClick={() => changeCalender("next")} />
        </div>
        <h1 className="date-title">{date.format("MMMM YYYY")}</h1>
      </div>
      <div className="dropdown-container" ref={ref}>
        <div className="dropdown-button-container">
          <button
            type="button"
            className="dropdown-button"
            onClick={toggleDropdown}
          >
            {selectedCalendar}
            <PiCaretDownLight className="dropdown-icon" aria-hidden="true" />
          </button>
        </div>

        {isOpen && (
          <div
            className="dropdown-menu"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="dropdown-menu-items" role="none">
              {dropdownMenu.map((curr, id) => {
                return (
                  <NavLink
                    to={curr.URL}
                    className={`dropdown-menu-item ${
                      curr.text.toLowerCase() !==
                        selectedCalendar.toLowerCase() && "hover-bg"
                    }`}
                    style={{
                      color:
                        curr.text.toLowerCase() ===
                          selectedCalendar.toLowerCase() && "#419eff",
                    }}
                    key={id}
                    onClick={() => setIsOpen(false)}
                  >
                    {curr.text}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
