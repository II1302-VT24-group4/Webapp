// right now the owner of an event is stored directly in the meeting object, perhaps not the most secure solution

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

export default function SingleRoomColumnView(props) {
  //console.log(props.users);

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
  const [file, setFile] = useState(null); // State to hold uploaded file
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null); // State for error message during upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState("");
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 1) {
      const filtered = keepOnlyEmails(props.users).filter((email) =>
        email.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails([]);
    }
  };

  const addParticipantByEmail = (email) => {
    const emailLowerCase = email.toLowerCase();
    if (!participants.some((p) => p.name.toLowerCase() === emailLowerCase)) {
      setParticipants((prev) => [...prev, { name: emailLowerCase }]);
      setSearch("");
      setFilteredEmails([]);
    } else {
      alert("This email is already added.");
    }
  };

  function keepOnlyEmails(users) {
    const emailArray = [];
    for (let i = 0; i < users.length; i++) {
      emailArray.push(users[i].email);
    }
    return emailArray;
  }

  const removeParticipant = (participant) => {
    const updatedParticipants = participants.filter(
      (p) => p.name !== participant.name
    );
    setParticipants(updatedParticipants);
  };

  const updateDayCellBackground = () => {
    const calendarEl = calendarRef.current;
    const dayRows = calendarEl.querySelectorAll(".fc-timegrid-slots tr"); // Selecting rows
    for (let i = 0; i < dayRows.length; i++) {
      const cell = dayRows[i];

      if (i % 2 === 0) {
        cell.style.backgroundColor = "#81a59c"; // Set background color for even index cells
      } else {
        cell.style.backgroundColor = "#648A7A"; // Set background color for odd index cells
      }
    }
  };

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
    let participant = [];
    for(const userInArray of props.users){
      if(userInArray.id === owner){
        participant.push(userInArray);
        break;
      }
    }
    const eventData = {
      title: eventTitle,
      startDate: startDate.date,
      startTime: startDate.time,
      endDate: endDate.date,
      endTime: endDate.time,
      id: props.id,
      name: props.name,
      owner: owner,
      participants: participant
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
    let participantUsersObjs = [];
    for(const participant of participants){
      for(const userInArray of props.users){
        console.log(userInArray.email, participant.name, props.user.user);
        if(userInArray.email === participant.name || props.user.user === participant.name ){
          participantUsersObjs.push(userInArray);
        }
      }
    }

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
      participants: participantUsersObjs
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
    setSelectedFile(e.target.files[0]);
    //setFileName(e.target.files[0].name);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      // Generate a unique filename based on current timestamp and original filename
      const generatedFileName = `${Date.now()}_${selectedFile.name}`;
      const date = dateToStrings(startTime);

      // Call the uploadFileToStorage function to upload the selected file
      await uploadFileToStorage(
        selectedFile,
        generatedFileName,
        props.id,
        date.date,
        date.time
      );

      // Set uploadComplete to true after successful upload
      setUploadComplete(true);

      // Log success message
      console.log("File uploaded successfully.");

      // Reset error state if upload is successful
      setError(null);
    } catch (error) {
      // Set error state if file upload fails
      setError("Error uploading file.");
      console.error("Error uploading file:", error);
    } finally {
      // Set uploading state back to false after upload completes (whether successful or not)
      setUploading(false);
    }
  };

  const handleFileUpload = () => {
    // Logic to handle file upload using handleUpload function
    handleUpload(); // Call handleUpload function when upload button is clicked
  };

  const emails = keepOnlyEmails(props.users);

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
        left: "",
        center: "",
        right: "",
      },
      viewDidMount: function (view) {
        const titleElement = calendarEl.querySelector(
          ".fc-toolbar-chunk:nth-child(2)"
        );
        if (titleElement) {
          const nameElement = document.createElement("div");
          nameElement.textContent = props.name;
          nameElement.style.fontSize = "30px";
          nameElement.style.height = "40px";
          nameElement.style.lineHeight = "40px";
          nameElement.style.width = "110px";
          nameElement.style.textAlign = "center"; // Center the text horizontally

          const seatsElement = document.createElement("span");
          seatsElement.textContent = "Seats: ";
          if (props.seats !== undefined) {
            seatsElement.textContent += props.seats;
          }
          seatsElement.style.height = "20px";
          seatsElement.style.fontSize = "18px";
          seatsElement.style.display = "block";
          nameElement.style.width = "110px";
          seatsElement.style.textAlign = "center"; // Center the text horizontally

          titleElement.appendChild(nameElement);
          titleElement.appendChild(seatsElement);
        }
        const slotElements = calendarEl.querySelectorAll("tr");
        slotElements.forEach((slot) => {
          slot.style.height = "25px";
        });
        updateDayCellBackground();
      },
      eventOverlap: false,
      selectOverlap: false,
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    });
    newCalendar.setOption("height", 853);
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

      setEventTitle(selectedEvent.title);
    }
  }, [selectedEvent]);

  // Change day
  useEffect(() => {
    if (calendar) {
      const newDate = new Date(calendar.getDate());
      if (props.date > currentDate) {
        newDate.setDate(newDate.getDate() + 1);
        calendar.gotoDate(newDate);
      } else if (props.date < currentDate) {
        newDate.setDate(newDate.getDate() - 1);
        calendar.gotoDate(newDate);
      }
      setCurrentDate(props.date);
      updateDayCellBackground();
    }
  }, [props.date]);

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
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
              display: "flex",
              flexDirection: "column",
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
            <div style={{ marginTop: "20px" }} class="edit-event-popup">
              <button
                class="wide-button"
                style={{ marginRight: "80px", backgroundColor: "white" }}
                onClick={() => setSelectedInfo(null)}
              >
                Cancel
              </button>
              <button
                class="wide-button"
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
              class="edit-event-popup"
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
              <div class="event-title">
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
                <div>
                  <h4>Add participants</h4>
                  <input
                    type="text"
                    placeholder="Enter email prefix"
                    value={search}
                    onChange={handleSearchChange}
                    style={{ marginBottom: "10px" }}
                  />
                  {filteredEmails.length > 0 && (
                    <div>
                      <h4>Search Results:</h4>
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {filteredEmails.map((email) => (
                          <li
                            key={email}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              backgroundColor: "#f4f4f4",
                              borderBottom: "1px solid #ddd",
                            }}
                            onClick={() => addParticipantByEmail(email)}
                          >
                            {email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <h4>Current participants</h4>
                  <ul>
                    {participants.map((participant, index) => (
                      <li key={index} class="li-with-button">
                        {participant.name}
                        <button
                          onClick={() => removeParticipant(participant)}
                          class="remove-button"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
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
                <input type="file" id="file" onChange={handleFileChange} />
                <button
                  onClick={handleFileUpload}
                  disabled={uploading}
                  class="wide-button"
                >
                  Upload
                </button>
                {error && <p>{error}</p>}
                {uploading && <p>Uploading...</p>}
                {uploadComplete && <p>Uploading finished!</p>}
              </div>
              <div style={{ marginTop: "20px" }}>
                <button
                  class="wide-button"
                  style={{ marginRight: "35px", backgroundColor: "white" }}
                  onClick={() => {
                    setSelectedEvent(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  class="wide-button"
                  style={{ marginRight: "35px", backgroundColor: "white" }}
                  onClick={() => {
                    setConfirmationPopup("remove");
                  }}
                >
                  Remove
                </button>
                <button
                  class="wide-button"
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
