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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [file, setFile] = useState(null); // State to hold uploaded file
  const [calendarInitialized, setCalendarInitialized] = useState(false); // New state to track calendar initialization

  const isOverlapping = async (newEvent) => {
    const events = await calendar.getEvents();
    for (const oldEvent in events) {
      if (newEvent.endDate > events[oldEvent].start && newEvent.startDate < events[oldEvent].end && newEvent.id != events[oldEvent].id) {
        return true;
      }
    }
    return false;
  }

  async function populateCalendar() {
    const meetings = await props.getMeetings(props.room);
    for (const meeting of meetings) {
      const title = meeting.title;
      const startDate = meeting.startDate?.toDate();
      const endDate = meeting.endDate?.toDate();
      const id = meeting.id;
      const owner = meeting.owner;
      createEvent(title, startDate, endDate, owner, id);
    }
  }

  function createEvent(title, startDate, endDate, owner, id){
    calendar.addEvent({
      title: title,
      start: startDate,
      end: endDate,
      id: id,
      extendedProps: {
        owner: owner
      },
    });
    calendar.render();
  }

  const handleCreateEvent = async () => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const owner = props.user.user;
    const eventData = {
      title: eventTitle,
      startDate: startDate,
      endDate: endDate,
      room: props.room,
      owner: owner
    };

    if(await isOverlapping(eventData)){
      alert("event is overlapping another event");
    }
    else{
      const id = await props.addMeeting(eventData);

      createEvent(
        eventTitle,
        startDate,
        endDate,
        owner,
        id
      );
    }
    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setSelectedInfo(null);
  }

  const handleUpdateEvent = async () => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const eventData = {
      title: eventTitle,
      startDate: startDate,
      endDate: endDate,
      room: props.room,
      id: selectedEvent.id,
      file: file
    };

    if(await isOverlapping(eventData)){
      alert("event is overlapping another event");
    }
    else{
      props.updateMeeting(eventData);

      selectedEvent.setProp('title', eventTitle);
      selectedEvent.setStart(startDate);
      selectedEvent.setEnd(endDate);
    }
    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setSelectedEvent(null);
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
      allDaySlot: false,
      slotMinTime: "06:00:00", // Show slots starting from 6 AM
      slotMaxTime: "21:00:00", // Show slots until 9 PM
      selectable: true, // Enable selection
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
      eventClick: function (event) {
        setSelectedEvent(event.event);
      },
      forceEventDuration: true, // Ensure events are displayed even without an end time
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek",
      },
    });
    setCalendar(newCalendar);
    newCalendar.render();
    setCalendarInitialized(true);

    // Cleanup function to destroy the calendar when the component unmounts
    return () => {
      newCalendar.destroy();
    };
  }, []);

  // Populate calendar after initialization
  useEffect(() => {
    if (calendarInitialized) {
      populateCalendar();
    }
  }, [calendarInitialized]);

  // Initialize startTime and endTime with the times from selectedInfo, if available, and set their constants for use when creating event
  useEffect(() => {
    if (selectedInfo) {
      const startTimeStr = new Date(selectedInfo.start.getTime() - selectedInfo.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setStartTime(startTimeStr);
      
      const endTimeStr = new Date(selectedInfo.end.getTime() - selectedInfo.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setEndTime(endTimeStr);
    }
  }, [selectedInfo]);

  // Initialize startTime, endTime and title with the times from selectedEvent, if available, and set their constants for use when updating event
  useEffect(() => {
    if (selectedEvent) {
      const startTimeStr = new Date(selectedEvent.start.getTime() - selectedEvent.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setStartTime(startTimeStr);
      
      const endTimeStr = new Date(selectedEvent.end.getTime() - selectedEvent.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setEndTime(endTimeStr);

      setEventTitle(selectedEvent.title);
    }
  }, [selectedEvent]);

  return (
    <div style={{ width: "98%", margin: "5" }}>
      <div ref={calendarRef} />
      {selectedInfo && (
        <Popup
          open={selectedInfo !== null}
          onClose={() => {
            setSelectedInfo(null);
            setEventTitle(""); // Reset event title input
          }}
          modal
          closeOnDocumentClick
        >
          <div
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "5px",
              textAlign: "right"
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Create Event</h2>
            <div>
              <label htmlFor="title">Title:&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <input
                office="text"
                placeholder="Event Title"
                style={{ marginBottom: "10px", width: "164px"}}
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="startTime">Start Time:&nbsp;</label>
              <input
                type="datetime-local"
                office="time"
                id="startTime"
                style={{ marginLeft: "10px" }}
                value={startTime}
                onChange={(e) => {
                  const selectedHours = e.target.value.split(':')[0];
                  setStartTime(`${selectedHours}:00`);
                }}                
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="endTime">End Time:</label>
              <input
                type="datetime-local"
                office="time"
                id="endTime"
                style={{ marginLeft: "14px" }}
                value={endTime}
                onChange={(e) => {
                  const selectedHours = e.target.value.split(':')[0];
                  setEndTime(`${selectedHours}:00`);
                }}  
              />
            </div>
            <div style={{marginTop: "20px"}}>
              <button
                style={{ marginRight: "80px", backgroundColor: "white" }}
                onClick={() => setSelectedInfo(null)}
              >
                Cancel
              </button>
              <button
                style={{ marginRight:"20px", backgroundColor: "white" }}
                onClick={handleCreateEvent}
              >
                Save Event
              </button>
            </div>
          </div>
        </Popup>
      )}
      {selectedEvent && (
        <Popup
        open={selectedEvent !== null}
        onClose={() => {
          setSelectedEvent(null);
        }}
        modal
        closeOnDocumentClick
      >
        <div
          style={{
            padding: "20px",
            background: "white",
            borderRadius: "5px",
            textAlign: "right"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Edit Event</h2>
          <div>
            <label htmlFor="title">Title:&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input
              type="text"
              placeholder="Event Title"
              style={{ marginBottom: "10px", width: "164px"}}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)
              }
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="startTime">Start Time:&nbsp;</label>
            <input
              type="datetime-local"
              id="startTime"
              style={{ marginLeft: "10px" }}
              value={startTime}
              onChange={(e) => {
                const selectedHours = e.target.value.split(':')[0];
                setStartTime(`${selectedHours}:00`);
              }}  
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="endTime">End Time:</label>
            <input
              type="datetime-local"
              id="endTime"
              style={{ marginLeft: "14px" }}
              value={endTime}
              onChange={(e) => {
                const selectedHours = e.target.value.split(':')[0];
                setEndTime(`${selectedHours}:00`);
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
              />
            </div>
          <div style={{marginTop: "20px"}}>
            <button
              style={{ marginRight: "35px", backgroundColor: "white" }}
              onClick={() => {
                setSelectedEvent(null);
              }}
            >
              Cancel
            </button>
            <button
              style={{ marginRight: "35px", backgroundColor: "white" }}
              //not sure if we want to be able to remove events in personal calendar
              //onClick={handleRemoveEvent}
            >
              Remove
            </button>
            <button
              style={{ marginRight: "10px", backgroundColor: "white" }}
              onClick={handleUpdateEvent}
            >
              Confirm
            </button>
          </div>
        </div>
      </Popup>
      )}
    </div>
  );
}
