import dayjs from "dayjs";
import React, { useContext, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineEdit, AiTwotoneDelete } from "react-icons/ai";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { CalendarContext } from "../../App";
import '../../style/ToolTip.css'; 

dayjs.extend(customParseFormat);

const Tooltip = ({
  isVisible,
  setIsVisible,
  found,
  setShowPopUpType,
  color,
  position = "left",
}) => {
  const { fetchCalendar } = useContext(CalendarContext);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const deleteSchedule = async (id) => {
    axios.delete(`/api/schedule/${id}`).then((response) => {
      console.log(response.data);
      response?.data && fetchCalendar();
    })
    .catch((err) => {
      console.log("Error", err);
    });
  };

  return (
    <>
      {isVisible === found?._id && (
        <div
          ref={ref}
          className={`tooltip ${position === "left" ? "tooltip-left" : ""} ${position === "right" ? "tooltip-right" : ""} ${position === "bottom" ? "tooltip-bottom" : ""}`}
          style={{ '--tooltip-color': color }}
        >
          <div className="tooltip-header">
            <button
              onClick={(event) => {
                event.stopPropagation();
                deleteSchedule(found?._id);
                setIsVisible(false);
              }}
              className="tooltip-button"
            >
              <AiTwotoneDelete className="tooltip-icon" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setShowPopUpType(found);
                setIsVisible(false);
              }}
              className="tooltip-button"
            >
              <AiOutlineEdit className="tooltip-icon" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setIsVisible(false);
              }}
              className="tooltip-button"
            >
              <AiOutlineClose className="tooltip-icon" />
            </button>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-color"></div>
            <div>
              <p className="tooltip-content-text">{found.title}</p>
              <p className="tooltip-content-subtext">
                {dayjs(`${found.date} ${found.time}`).format(
                  "dddd, DD MMMM, hh:mm A"
                )}
              </p>
              <p className="tooltip-content-description">{found.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
