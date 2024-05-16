import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";
import { uploadFileToStorage } from "../firebaseModel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CalendarInGridView(props) {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState(""); // State to hold event title
  const [startTime, setStartTime] = useState(""); // State to hold start time
  const [oldStartTime, setOldStartTime] = useState("");
  const [endTime, setEndTime] = useState(""); // State to hold end time
  const [file, setFile] = useState(null); // State to hold uploaded file
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null); // State for error message during upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState("");

  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const [participants, setParticipants] = useState([]);

  const isOverlapping = async (newEvent) => {
    const events = await calendar.getEvents();
    for (const oldEvent in events) {
      if (
        newEvent.endDate > events[oldEvent].start &&
        newEvent.startDate < events[oldEvent].end &&
        newEvent.id != events[oldEvent].id
      ) {
        return true;
      }
    }
    return false;
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    const participantName = e.target.elements.participantName.value.trim();
    if (participantName) {
      setParticipants([...participants, { name: participantName }]);
      e.target.elements.participantName.value = "";
    }
  };

  const removeParticipant = (participant) => {
    const updatedParticipants = participants.filter(
      (p) => p.name !== participant.name
    );
    setParticipants(updatedParticipants);
  };

  function dateToStrings(value) {
    const [date, time] = value.split("T");
    const [year, month, day] = date.split("-");
    const formattedDate = `${year}-${parseInt(month)}-${parseInt(day)}`;
    return { date: formattedDate, time: time };
  }

  function stringsToDate(dateValue, timeValue) {
    const [year, month, day] = dateValue.split("-").map(Number);
    const [hours, minutes] = timeValue.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  function formatDateTime(dateString) {
    const dateObject = new Date(dateString);

    // Extract the date components
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    // Extract the time components
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    // Combine date and time components to form the desired format
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDateTime;
  }

  async function populateCalendar() {
    const meetings = await props.getMeetings(props.id);
    if (meetings.length !== 0) {
      for (const meeting of meetings) {
        const title = meeting.title;
        const startDate = stringsToDate(meeting.startDate, meeting.startTime);
        const endDate = stringsToDate(meeting.endDate, meeting.endTime);
        const id = meeting.id;
        const owner = meeting.owner;
        const downloads = meeting.downloads;
        createEvent(title, startDate, endDate, owner, id, downloads);
      }
    }
  }

  function createEvent(title, startDate, endDate, owner, id, downloads) {
    calendar.addEvent({
      title: title,
      start: startDate,
      end: endDate,
      id: id,
      extendedProps: {
        owner: owner,
        downloads: downloads,
      },
    });
    calendar.render();
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
      id: props.id,
      name: props.name,
      owner: owner,
    };

    if (await isOverlapping(eventData)) {
      alert("event is overlapping another event");
    } else {
      const id = await props.addMeeting(eventData);
      const startDateObj = new Date(startTime);
      const endDateObj = new Date(endTime);
      createEvent(eventTitle, startDateObj, endDateObj, owner, id);
    }
    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setSelectedInfo(null);
  };

  const handleUpdateEvent = async () => {
    const startDate = dateToStrings(startTime);
    let oldStartDate = null;
    if (oldStartTime === "") {
      oldStartDate = startDate;
    } else {
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
      id: props.id,
      name: props.name,
      owner: owner,
    };

    if (await isOverlapping(eventData)) {
      alert("event is overlapping another event");
    } else {
      props.updateMeeting(eventData);

      const startDateObj = new Date(startTime);
      const endDateObj = new Date(endTime);

      selectedEvent.setProp("title", eventTitle);
      selectedEvent.setStart(startDateObj);
      selectedEvent.setEnd(endDateObj);
    }
    setEventTitle("");
    setStartTime("");
    setOldStartTime("");
    setEndTime("");
    setSelectedEvent(null);
  };

  const handleRemoveEvent = () => {
    const startDate = dateToStrings(startTime);

    const eventData = {
      id: props.id,
      startDate: startDate.date,
      startTime: startDate.time,
    };
    props.deleteMeeting(eventData);

    selectedEvent.remove();

    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setSelectedEvent(null);
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...filesArray]);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    try {
      setUploading(true);

      // Iterate over each selected file and upload
      await Promise.all(
        selectedFiles.map(async (file) => {
          const generatedFileName = `${Date.now()}_${file.name}`;
          const date = dateToStrings(startTime);

          // Call upload function for each file
          await uploadFileToStorage(
            file,
            generatedFileName,
            props.id,
            date.date,
            date.time
          );
        })
      );

      setUploadComplete(true);
      setError(null); // Reset error state
      setSelectedFiles([]); // Clear selected files after upload
      console.log("Files uploaded successfully.");
    } catch (err) {
      setError("Error uploading file(s).");
      console.error("Error uploading file(s):", err);
    } finally {
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
      selectable: props.id !== undefined, // Enable selection
      slotLabelInterval: { hours: 0.5 },
      slotDuration: "00:30:00",
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
        right: "",
      },
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
      slotLabelFormat: {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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
      const startTimeStr = new Date(
        selectedEvent.start.getTime() -
          selectedEvent.end.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setStartTime(startTimeStr);

      const endTimeStr = new Date(
        selectedEvent.end.getTime() -
          selectedEvent.end.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setEndTime(endTimeStr);
      setEventTitle(selectedEvent._def.title);
    }
  }, [selectedEvent]);

  // Initialize startTime and endTime with the times from selectedInfo, if available, and set their constants for use when creating event
  useEffect(() => {
    if (selectedInfo) {
      const startTimeStr = new Date(
        selectedInfo.start.getTime() -
          selectedInfo.end.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setStartTime(startTimeStr);

      const endTimeStr = new Date(
        selectedInfo.end.getTime() -
          selectedInfo.end.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setEndTime(endTimeStr);
    }
  }, [selectedInfo]);

  const renderFileList = () => {
    return (
      <ul>
        {selectedFiles.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ width: "98%", margin: "5" }}>
      <div ref={calendarRef} />
      {selectedInfo && (
        <Popup
          open={selectedInfo !== null}
          onClose={() => {
            if (confirmationPopup === "") {
              setSelectedInfo(null);
              setEventTitle(""); // Reset event title input
            }
          }}
          modal
          closeOnDocumentClick
          className="calendar-popup"
        >
          <div
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "5px",
              textAlign: "right",
              borderStyle: "solid",
              borderWidth: "2px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Create Event</h2>
            <div>
              <label htmlFor="title">Title:&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <input
                office="text"
                placeholder="Event Title"
                style={{ marginBottom: "10px", width: "164px" }}
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="startTime">Start Time:&nbsp;</label>
              {startTime && (
                <DatePicker
                  selected={new Date(startTime)}
                  onChange={(date) => setStartTime(formatDateTime(date))}
                  showTimeSelect
                  timeIntervals={30}
                  timeFormat="HH:mm"
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              )}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="endTime">End Time:</label>
              {endTime && (
                <DatePicker
                  selected={new Date(endTime)}
                  onChange={(date) => setEndTime(formatDateTime(date))}
                  showTimeSelect
                  timeIntervals={30}
                  timeFormat="HH:mm"
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              )}
            </div>
            <div style={{ marginTop: "20px" }}>
              <button
                style={{ marginRight: "80px", backgroundColor: "white" }}
                onClick={() => setSelectedInfo(null)}
              >
                Cancel
              </button>
              <button
                style={{ marginRight: "20px", backgroundColor: "white" }}
                onClick={() => {
                  setConfirmationPopup("create");
                }}
              >
                Save Event
              </button>
            </div>
          </div>
        </Popup>
      )}
      {selectedEvent &&
        props.user.user == selectedEvent.extendedProps.owner && (
          <Popup
            open={selectedEvent !== null}
            onClose={() => {
              if (confirmationPopup === "") {
                setSelectedEvent(null);
              }
            }}
            modal
            closeOnDocumentClick
            className="calendar-popup"
          >
            <div
              style={{
                padding: "20px",
                background: "white",
                borderRadius: "5px",
                textAlign: "right",
                borderStyle: "solid",
                borderWidth: "2px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Edit Event</h2>
              <div>
                <label htmlFor="title">Title:&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input
                  type="text"
                  placeholder="Event Title"
                  style={{ marginBottom: "10px", width: "164px" }}
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="startTime">Start Time:&nbsp;</label>
                {startTime && (
                  <DatePicker
                    selected={new Date(startTime)}
                    onChange={(date) => setStartTime(formatDateTime(date))}
                    showTimeSelect
                    timeIntervals={30}
                    timeFormat="HH:mm"
                    dateFormat="yyyy-MM-dd HH:mm"
                  />
                )}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="endTime">End Time:</label>
                {endTime && (
                  <DatePicker
                    selected={new Date(endTime)}
                    onChange={(date) => setEndTime(formatDateTime(date))}
                    showTimeSelect
                    timeIntervals={30}
                    timeFormat="HH:mm"
                    dateFormat="yyyy-MM-dd HH:mm"
                  />
                )}
              </div>
              {selectedEvent &&
                selectedEvent.extendedProps &&
                selectedEvent.extendedProps.downloads && (
                  <div style={{ textAlign: "left", marginBottom: "10px" }}>
                    Download Files:
                    {selectedEvent.extendedProps.downloads.map(
                      (download, index) => (
                        <div key={index}>
                          <a
                            href={download.downloadURL}
                            download={download.name}
                          >
                            {download.name}
                          </a>
                        </div>
                      )
                    )}
                  </div>
                )}
              <div>
                {/* Render participants list and form for adding/removing participants */}
                <h4>Add participants</h4>
                <form onSubmit={handleAddParticipant}>
                  <input
                    name="participantName"
                    type="text"
                    placeholder="Enter name"
                    required
                  />
                  <button type="submit">Add name</button>
                </form>
                <h4>Remove specific participants</h4>
                <ul>
                  {participants.map((participant, index) => (
                    <li key={index}>
                      {participant.name}
                      <button onClick={() => removeParticipant(participant)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                {/* Other JSX and component logic */}
              </div>

              <div>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  multiple
                />
                <button
                  onClick={handleFileUpload}
                  disabled={uploading || selectedFiles.length === 0}
                >
                  Upload
                </button>
                {error && <p>{error}</p>}
                {uploading && <p>Uploading...</p>}
                {uploadComplete && <p>Uploading finished!</p>}
              </div>
              {selectedFiles.length > 0 && (
                <div style={{ textAlign: "left", marginBottom: "10px" }}>
                  Selected Files:
                  {renderFileList()}
                </div>
              )}

              <div style={{ marginTop: "20px" }}>
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
                  onClick={() => {
                    setConfirmationPopup("remove");
                  }}
                >
                  Remove
                </button>
                <button
                  style={{ marginRight: "10px", backgroundColor: "white" }}
                  onClick={() => {
                    setConfirmationPopup("update");
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </Popup>
        )}
      {selectedEvent &&
        props.user.user != selectedEvent.extendedProps.owner && (
          <Popup
            open={selectedEvent !== null}
            onClose={() => {
              setSelectedEvent(null);
            }}
            modal
            closeOnDocumentClick
            className="calendar-popup"
          >
            <div
              style={{
                padding: "20px",
                background: "white",
                borderRadius: "5px",
                textAlign: "left",
                borderStyle: "solid",
                borderWidth: "2px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Event Information</h2>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="title">Title: {eventTitle}</label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="startTime">
                  Start Time:&nbsp;{startTime.split("T")[1]}
                </label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="endTime">
                  End Time: {endTime.split("T")[1]}
                </label>
              </div>
              <div style={{ marginTop: "20px" }}>
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
        )}
      {confirmationPopup && (
        <Popup
          open={confirmationPopup !== null}
          onClose={() => {
            setConfirmationPopup(null);
          }}
          modal
          closeOnDocumentClick
          className="calendar-popup"
        >
          <div
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "5px",
              textAlign: "right",
              borderStyle: "solid",
              borderWidth: "2px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Are you sure?</h2>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "row",
                justifyContent: "space-between",
              }}
            >
              <button
                style={{
                  marginRight: "10px",
                  backgroundColor: "white",
                  minWidth: "3vw",
                }}
                onClick={() => {
                  if (confirmationPopup === "remove") {
                    handleRemoveEvent();
                  } else if (confirmationPopup === "update") {
                    handleUpdateEvent();
                  } else if (confirmationPopup === "create") {
                    handleCreateEvent();
                  }
                  setConfirmationPopup("");
                }}
              >
                Yes
              </button>
              <button
                style={{
                  marginRight: "10px",
                  backgroundColor: "white",
                  minWidth: "3vw",
                }}
                onClick={() => {
                  setConfirmationPopup(null);
                }}
              >
                No
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
