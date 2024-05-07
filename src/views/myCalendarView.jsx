import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";
import { uploadFileToStorage } from "../firebaseModel";

export default function MyCalendarView(props) {
  
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState(""); // State to hold event title
  const [startTime, setStartTime] = useState(""); // State to hold start time
  const [oldStartTime, setOldStartTime] = useState("");
  const [endTime, setEndTime] = useState(""); // State to hold end time
  const [file, setFile] = useState(null); // State to hold uploaded file
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null); // State for error message during upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [room, setRoom] = useState("");

  const [calendarInitialized, setCalendarInitialized] = useState(false);

  const isOverlapping = async (newEvent) => {
    const events = await calendar.getEvents();
    for (const oldEvent in events) {
      if (newEvent.endDate > events[oldEvent].start && newEvent.startDate < events[oldEvent].end && newEvent.id != events[oldEvent].id) {
        return true;
      }
    }
    return false;
  };

  function dateToStrings(value){
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

  async function populateCalendar() {
    const meetings = await props.getMeetings(props.room);
    if(meetings.length !== 0){
      for (const meeting of meetings) {
        const title = meeting.title;
        const startDate = stringsToDate(meeting.startDate, meeting.startTime);
        const endDate = stringsToDate(meeting.endDate, meeting.endTime);
        const owner = meeting.owner;
        const room = meeting.room;
        createEvent(title, startDate, endDate, owner, room);
      }
    }
  }

  function createEvent(title, startDate, endDate, owner, room){
    calendar.addEvent({
      title: title,
      start: startDate,
      end: endDate,
      extendedProps: {
        owner: owner,
        room: room
      },
    });
    calendar.render();
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
      room: room,
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
    setRoom("");
    setSelectedEvent(null);
  };

  const handleRemoveEvent = () => {
    const startDate = dateToStrings(startTime);
    
    const eventData = {
      room: room,
      startDate: startDate.date,
      startTime: startDate.time
    };
    props.deleteMeeting(eventData);

    selectedEvent.remove();
    
    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setSelectedEvent(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    //setFileName(e.target.files[0].name);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }
  
    try {
      setUploading(true);
  
      // Generate a unique filename based on current timestamp and original filename
      const generatedFileName = `${Date.now()}_${selectedFile.name}`;
  
      // Call the uploadFileToStorage function to upload the selected file
      await uploadFileToStorage(selectedFile, generatedFileName);
  
      // Set uploadComplete to true after successful upload
      setUploadComplete(true);
  
      // Log success message
      console.log('File uploaded successfully.');
  
      // Reset error state if upload is successful
      setError(null);
    } catch (error) {
      // Set error state if file upload fails
      setError('Error uploading file.');
      console.error('Error uploading file:', error);
    } finally {
      // Set uploading state back to false after upload completes (whether successful or not)
      setUploading(false);
    }
  };
  
  const handleFileUpload = () => {
    // Logic to handle file upload using handleUpload function
    handleUpload(); // Call handleUpload function when upload button is clicked
  };

  //Calendar creation
  useEffect(() => {
    const calendarEl = calendarRef.current;
    const newCalendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      allDaySlot: false,
      slotMinTime: "06:00:00", // Show slots starting from 6 AM
      slotMaxTime: "21:00:00", // Show slots until 9 PM
      selectable: true, // Enable selection
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

  // Initialize startTime, endTime and title with the times from selectedEvent, if available, and set their constants for use when updating event
  useEffect(() => {
    if (selectedEvent) {
      const startTimeStr = new Date(selectedEvent.start.getTime() - selectedEvent.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setStartTime(startTimeStr);
      
      const endTimeStr = new Date(selectedEvent.end.getTime() - selectedEvent.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setEndTime(endTimeStr);
      setEventTitle(selectedEvent._def.title);
      setRoom(selectedEvent.extendedProps.room);
    }
  }, [selectedEvent]);

  return (
    <div style={{ width: "98%", margin: "5" }}>
      <div ref={calendarRef} />
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
          <div >
            <input type="file" id="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload} disabled={uploading}>
              
              Upload
            </button>
            {error && <p>{error}</p>}
            {uploading && <p>Uploading...</p>}
            {uploadComplete && <p>Uploading finished!</p>}
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
            textAlign: "left"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Event Information</h2>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="title">Title: {eventTitle}</label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="startTime">Start Time:&nbsp;{startTime.split('T')[1]}</label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="endTime">End Time: {endTime.split('T')[1]}</label>
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
