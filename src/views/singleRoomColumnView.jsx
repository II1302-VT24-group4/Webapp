// right now the owner of an event is stored directly in the meeting object, perhaps not the most secure solution

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
  const [oldStartTime, setOldStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calendarInitialized, setCalendarInitialized] = useState(false); // New state to track calendar initialization
  const [currentDate, setCurrentDate] = useState(0);

  const isOverlapping = async (newEvent) => {
    const events = await calendar.getEvents();
    for (const oldEvent in events) {
      if (newEvent.endDate > events[oldEvent].start && newEvent.startDate < events[oldEvent].end && newEvent.id != events[oldEvent].id) {
        return true;
      }
    }
    return false;
  }

  const updateDayCellBackground = () => {
    const calendarEl = calendarRef.current;
    const dayCells = calendarEl.querySelectorAll('.fc-day');
    dayCells.forEach(cell => {
      cell.style.backgroundColor = '#81a59c'; // Change to your desired background color
    });
  };

  async function populateCalendar() {
    const meetings = await props.getMeetings(props.room);
    if(meetings.length !== 0){
      for (const meeting of meetings) {
        const title = meeting.title;
        const startDate = stringsToDate(meeting.startDate, meeting.startTime);
        const endDate = stringsToDate(meeting.endDate, meeting.endTime);
        const id = meeting.id;
        const owner = meeting.owner;
        createEvent(title, startDate, endDate, owner, id);
      }
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

  function dateToStrings(value){
    console.log(value);
    const [date, time] = value.split('T');
    const [year, month, day] = date.split('-');
    const formattedDate = `${year}-${parseInt(month)}-${parseInt(day)}`;
    return {date: formattedDate, time: time};
  }

  function stringsToDate(dateValue, timeValue) {
    const [year, month, day] = dateValue.split('-').map(Number);
    const [hours, minutes] = timeValue.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  const handleCreateEvent = async () => {
    const startDate = dateToStrings(startTime);
    const endDate = dateToStrings(endTime);
    const owner = props.user.user;
    const eventData = {
      title: eventTitle,
      startDate: startDate.date,
      startTime: startDate.time,
      endDate: endDate.date,
      endTime: endDate.time,
      room: props.room,
      owner: owner
    };

    if(await isOverlapping(eventData)){
      alert("event is overlapping another event");
    }
    else{
      const id = await props.addMeeting(eventData);
      const startDateObj = new Date(startTime);
      const endDateObj = new Date(endTime);
      createEvent(
        eventTitle,
        startDateObj,
        endDateObj,
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
    const startDate = dateToStrings(startTime);
    let oldStartDate = null;
    if(oldStartTime === ""){
      oldStartDate = startDate;
    }
    else{
      oldStartDate = dateToStrings(oldStartTime);
    }
    const endDate = dateToStrings(endTime);
    const owner = props.user.user;

    const eventData = {
      title: eventTitle,
      oldStartDate: oldStartDate.date,
      oldStartTime: oldStartDate.time,
      startDate: startDate.date,
      startTime: startDate.time,
      endDate: endDate.date,
      endTime: endDate.time,
      room: props.room,
      owner: owner
    };

    if(await isOverlapping(eventData)){
      alert("event is overlapping another event");
    }
    else{
      props.updateMeeting(eventData);

      const startDateObj = new Date(startTime);
      const endDateObj = new Date(endTime);

      selectedEvent.setProp('title', eventTitle);
      selectedEvent.setStart(startDateObj);
      selectedEvent.setEnd(endDateObj);
    }
    setEventTitle("");
    setStartTime("");
    setOldStartTime("");
    setEndTime("");
    setSelectedEvent(null);
  }

  const handleRemoveEvent = () => {
    const startDate = dateToStrings(startTime);

    const eventData = {
      room: props.room,
      startDate: startDate.date,
      startTime: startDate.time
    };
    props.deleteMeeting(eventData);

    selectedEvent.remove();
    
    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setSelectedEvent(null);
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
      slotDuration: '01:00:00',
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
          center: "",
          right: ""
      },
      viewDidMount: function(view) {
          const titleElement = calendarEl.querySelector('.fc-toolbar-chunk:nth-child(2)');
          if (titleElement) {
              titleElement.textContent = props.room;
              titleElement.style.fontSize = "30px";
              titleElement.style.height = "40px";
              titleElement.style.lineHeight = "60px";
          }
          const slotElements = calendarEl.querySelectorAll('tr');
          slotElements.forEach(slot => {
            slot.style.height = '50px'; // Adjust the height as needed
          });
          updateDayCellBackground();
      },
      eventOverlap: false,
      selectOverlap: false
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

  // Change day
  useEffect(() => {
    if(calendar){
      const newDate = new Date(calendar.getDate());
      if (props.date > currentDate) {
        newDate.setDate(newDate.getDate() + 1);
        calendar.gotoDate(newDate);
      }
      else if(props.date < currentDate){
        newDate.setDate(newDate.getDate() - 1);
        calendar.gotoDate(newDate);
      }
      setCurrentDate(props.date);
      updateDayCellBackground();
    }
  }, [props.date]);

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
      {selectedEvent && props.user.user == selectedEvent.extendedProps.owner && (
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
                if (selectedEvent) {
                  const timezoneOffset = selectedEvent.start.getTimezoneOffset();
                  const adjustedStartDate = new Date(selectedEvent.start.getTime() - timezoneOffset * 60000);
                  const adjustedStartDateISO = adjustedStartDate.toISOString().slice(0, 16);
                  setOldStartTime(adjustedStartDateISO);                  
                }
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
              onClick={handleRemoveEvent}
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
      {selectedEvent && props.user.user != selectedEvent.extendedProps.owner && 
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
          <h2 style={{ marginBottom: "20px" }}>Event Information</h2>
          <div>
            <label htmlFor="title">Title:&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input
              type="text"
              placeholder="Event Title"
              style={{ marginBottom: "10px", width: "164px"}}
              value={eventTitle}
              disabled
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
              disabled
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
              disabled
              onChange={(e) => {
                const selectedHours = e.target.value.split(':')[0];
                setEndTime(`${selectedHours}:00`);
              }}
            />
          </div>
          <div style={{marginTop: "20px"}}>
            <button
              style={{ marginRight: "110px", backgroundColor: "white" }}
              onClick={() => {
                setSelectedEvent(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Popup>
      }
    </div>
  );
}