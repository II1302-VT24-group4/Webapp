import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";

export default function SingleRoomColumnView(props) {
    const calendarRef = useRef(null);
    const [calendar, setCalendar] = useState(null);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [calendarInitialized, setCalendarInitialized] = useState(false); // New state to track calendar initialization
  
    async function populateCalendar() {
      const meetings = await props.getMeetings(props.room);
      for (const meeting of meetings) {
        const title = meeting.title;
        const startDate = meeting.startDate?.toDate();
        const endDate = meeting.endDate?.toDate();
        const id = meeting.id;
        createEvent(title, startDate, endDate, id);
      }
    }
  
    function createEvent(title, startDate, endDate, id){
      calendar.addEvent({
        title: title,
        start: startDate,
        end: endDate,
        id: id
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
        room: props.room
      };
  
      props.addMeeting(eventData);
  
      createEvent(
        eventTitle,
        startDate,
        endDate
      );
      setSelectedInfo(null);
    }

    const handleUpdateEvent = () => {
      const startTimeStr = startTime.split("T")[1];
      const startDate = convertTime(selectedEvent, startTimeStr);
      const endTimeStr = endTime.split("T")[1];
      const endDate = convertTime(selectedEvent, endTimeStr);

      const eventData = {
        title: eventTitle,
        startDate: startDate,
        endDate: endDate,
        room: props.room,
        id: selectedEvent.id
      };
  
      props.updateMeeting(eventData);

      selectedEvent.setProp('title', eventTitle);
      selectedEvent.setStart(startDate);
      selectedEvent.setEnd(endDate);
      setSelectedEvent(null);
    }

    const handleRemoveEvent = () => {

      const eventData = {
        room: props.room,
        id: selectedEvent.id
      };
  
      props.deleteMeeting(eventData);

      selectedEvent.remove();
      setSelectedEvent(null);
    }
  
    function convertTime(info, time) {
      var date = new Date(info.startStr);
      var [hours, minutes] = time.split(":").map(Number);
      date.setHours(hours, minutes);
      return date;
    }
  
    //Calendar creation
    useEffect(() => {
      const calendarEl = calendarRef.current;
      const newCalendar = new Calendar(calendarEl, {
          plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
          initialView: "timeGridDay",
          allDaySlot: false,
          dayHeaders: false,
          slotMinTime: "06:00:00", // Show slots starting from 6 AM
          slotMaxTime: "21:00:00", // Show slots until 9 PM
          aspectRatio: 0.5,
          selectable: true,
          slotLabelInterval: { hours: 0 },
          select: function (info) {
              if(!info.startStr.includes("T")){
              info.startStr += "T13:00:00+02:00";
              }
              if(!info.endStr.includes("T")){
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
              left: "",
              center: "title",
              right: ""
          },
          viewDidMount: function(view) {
              const titleElement = calendarEl.querySelector('.fc-toolbar-title');
              if (titleElement) {
                  titleElement.textContent = props.room;
              }
          }
      });
      newCalendar.setOption('height', 833);
      setCalendar(newCalendar);
      newCalendar.render();
      setCalendarInitialized(true);
  
      // Cleanup function to destroy the calendar when the component unmounts
      return () => {
        newCalendar.destroy();
      };
    }, []); // Empty dependency array to ensure the effect runs only once after component mounting
  
    // Populate calendar after initialization
    useEffect(() => {
      if (calendarInitialized) {
        populateCalendar();
      }
    }, [calendarInitialized]);

    // Initialize startTime and endTime with the times from selectedInfo, if available
    useEffect(() => {
      if (selectedInfo) {
        const startTimeStr = selectedInfo.startStr.split("T")[1].substring(0, 5); // Extracting time part from ISO string
        setStartTime(startTimeStr);
  
        // Calculate default end time as start time + 1 hour
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

    // Initialize startTime, endTime and title with the times from selectedEvent, if available
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
      <div style={{width: '100%'}}>
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
              }}
            >
              <h2 style={{ marginBottom: "10px" }}>Create Event</h2>
              <input
                office="text"
                placeholder="Event Title"
                style={{ marginBottom: "10px", width: "100%" }}
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="startTime">Start Time:</label>
                <input
                  office="time"
                  id="startTime"
                  style={{ marginLeft: "10px" }}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="endTime">End Time:</label>
                <input
                  office="time"
                  id="endTime"
                  style={{ marginLeft: "14px" }}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
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
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>Edit Event</h2>
            <input
              type="text"
              placeholder="Event Title"
              style={{ marginBottom: "10px", width: "100%" }}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)
              }
            />
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="datetime-local"
                id="startTime"
                style={{ marginLeft: "10px" }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)
                }
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="endTime">End Time:</label>
              <input
                type="datetime-local"
                id="endTime"
                style={{ marginLeft: "14px" }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)
                }
              />
            </div>
            <button
              style={{ marginRight: "10px", backgroundColor: "white" }}
              onClick={() => {
                setSelectedEvent(null);
              }}
            >
              Cancel
            </button>
            <button
              style={{ marginRight: "10px", backgroundColor: "white" }}
              onClick={handleRemoveEvent}
            >
              Remove
            </button>
            <button
              style={{ backgroundColor: "white" }}
              onClick={handleUpdateEvent}
            >
              Confirm
            </button>
          </div>
        </Popup>
        )}
      </div>
    );
}
    