import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";

export default function MyCalendarView(props) {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [file, setFile] = useState(null); // State to hold uploaded file

  async function populateCalendar() {
    const meetings = await props.getMeetings();
    for (const meeting of meetings) {
      const title = meeting.title;
      const startDate = meeting.startDate.toDate();
      const endDate = meeting.endDate.toDate();
      createEvent(title, startDate, endDate);
    }
  }

  function createEvent(title, startDate, endDate) {
    calendar.addEvent({
      title: title,
      start: startDate,
      end: endDate
    });
    calendar.render();
  }

  const handleSaveEvent = () => {
    const startDate = convertTime(selectedInfo, startTime);
    const endDate = convertTime(selectedInfo, endTime);

    const eventData = {
      title: eventTitle,
      startDate: startDate,
      endDate: endDate,
      file: file // Include file in the event data
    };

    props.addMeeting(eventData);

    createEvent(
      eventTitle,
      startDate,
      endDate
    );
    setSelectedInfo(null); // Close the popup after saving the event
  };

  function convertTime(info, time) {
    var date = new Date(info.startStr);
    var [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours, minutes);
    return date;
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    const calendarEl = calendarRef.current;
    const newCalendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      selectable: true,
      select: function (info) {
        if (!info.startStr.includes("T")) {
          info.startStr += "T13:00:00+02:00";
        }
        if (!info.endStr.includes("T")) {
          info.endStr += "T14:00:00+02:00";
        }
        info.allDay = false;
        setSelectedInfo(info);
      },
      forceEventDuration: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek",
      },
    });
    setCalendar(newCalendar);
    newCalendar.render();

    // Cleanup function to destroy the calendar when the component unmounts
    return () => {
      newCalendar.destroy();
    };
  }, []);

  useEffect(() => {
    if (selectedInfo) {
      const startTimeStr = selectedInfo.startStr.split("T")[1].substring(0, 5);
      setStartTime(startTimeStr);

      const endTimeStr = new Date(selectedInfo.startStr);
      endTimeStr.setHours(endTimeStr.getHours() + 1);
      setEndTime(
        `${endTimeStr.getHours().toString().padStart(2, "0")}:${endTimeStr
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
    }
  }, [selectedInfo]);

  return (
    <div style={{ width: "98%", margin: "5" }}>
      <div ref={calendarRef} />
      {selectedInfo && (
        <Popup
          open={selectedInfo !== null}
          onClose={() => {
            setSelectedInfo(null);
            setEventTitle("");
            setAllDay(false);
          }}
          modal
          closeOnDocumentClick
        >
          <div
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>Create Event</h2>
            <input
              type="text"
              placeholder="Event Title"
              style={{ marginBottom: "10px", width: "100%" }}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                style={{ marginLeft: "10px" }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={allDay}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                style={{ marginLeft: "14px" }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={allDay}
              />
            </div>
          
            <div style={{ marginBottom: "10px" }}>
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
              <label htmlFor="allDay" style={{ marginLeft: "5px" }}>
                All Day
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
              />
            </div>
            <button
              style={{ marginRight: "10px", backgroundColor: "white" }}
              onClick={() => setSelectedInfo(null)}
            >
              Cancel
            </button>
            <button
              style={{ backgroundColor: "white" }}
              onClick={handleSaveEvent}
            >
              Save Event
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}
