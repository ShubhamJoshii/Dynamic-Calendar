import { createContext, useEffect, useState, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

const Calendar = lazy(() => import("./components/calendar/Calendar"));
const Header = lazy(() => import("./components/layout/Header"));
const SideMenu = lazy(() => import("./components/layout/SideMenu/SideMenu"));
const Schedule = lazy(() => import("./components/calendar/Schedule"));
const WeeklyCalendar = lazy(() => import("./components/calendar/WeeklyCalendar"));
const DailyCalendar = lazy(() => import("./components/calendar/DailyCalendar"));

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import HashLoader from "react-spinners/HashLoader";

import isoWeek from "dayjs/plugin/isoWeek";
import Loading from "./loading";

const CalendarContext = createContext();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

function App() {
  const [date, setDate] = useState(dayjs().tz("Asia/Kolkata"));
  const [type, setType] = useState(["Task", "Meeting", "Calling"]);
  const [publicHoliday, setPublicHoliday] = useState([]);
  let [loading, setLoading] = useState(true);
  const [CalendarData, setCalendarData] = useState([]);

  const changeCalender = (direction) => {
    if (direction === "prev") {
      let temp = dayjs(new Date(date.year(), date.month() - 1, date.date()));
      setDate(temp);
    } else {
      let temp = dayjs(new Date(date.year(), date.month() + 1, date.date()));
      setDate(temp);
    }
  };

  const fetchCalendar = async () => {
    setLoading(true);
    await axios
      .post("/api/allSchedule", { typeAllowed: type })
      .then((response) => {
        setCalendarData(response.data);
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const reScheduleCalendar = async (id, date, time) => {
    await axios
      .put(`/api/reschedule/${id}`, { id, date, time })
      .then((response) => {
        response?.data && fetchCalendar();
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateCalendar = async (id, data) => {
    await axios
      .put(`/api/schedule/${id}`, { id: id, ...data })
      .then((response) => {
        response?.data && fetchCalendar();
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchHolidays = async (year, month) => {
    await axios(
      `https://calendarific.com/api/v2/holidays?api_key=5Erv3UFqRquyzbt0FgkLfvBm1qC84s6E&country=IN&year=${year}`
    )
      .then((response) => {
        let holidays = response.data.response.holidays.filter((curr) => {
          const holidayDate = dayjs(curr.date.iso);
          return holidayDate.month() === month - 1;
        });
        setPublicHoliday(holidays);
      })
      .catch((err) => {
        console.error("Error fetching holidays:", err);
        return [];
      });
  };

  useEffect(() => {
    fetchHolidays(date.year(), date.month() + 1);
  }, [date]);

  useEffect(() => {
    fetchCalendar();
  }, [type]);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <div className="app-container">
          <Header
            date={date}
            setDate={setDate}
            changeCalender={changeCalender}
          />
          <CalendarContext.Provider
            value={{
              CalendarData,
              setCalendarData,
              updateCalendar,
              fetchCalendar,
              reScheduleCalendar,
              publicHoliday,
              fetchHolidays,
            }}
          >
            <div className="main-content">
              <SideMenu setDate={setDate} type={type} setType={setType} />
              {loading ? (
                <HashLoader
                  color={"rgb(9, 153, 228)"}
                  loading={loading}
                  size={50}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  className="loader"
                />
              ) : (
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Calendar
                        monthIndex={date.month()}
                        changeCalender={changeCalender}
                        year={date.year()}
                      />
                    }
                  />
                  <Route
                    path="/month"
                    element={
                      <Calendar
                        monthIndex={date.month()}
                        changeCalender={changeCalender}
                        year={date.year()}
                      />
                    }
                  />
                  <Route
                    path="/week"
                    element={<WeeklyCalendar setDate={setDate} />}
                  />
                  <Route path="/day" element={<DailyCalendar />} />
                  <Route path="/schedule" element={<Schedule />} />
                </Routes>
              )}
            </div>
          </CalendarContext.Provider>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
export { CalendarContext };
