import CalendarInGridView from "./calendarInGridView";
import React, { useState } from "react";
import { dbUsers } from "/src/firebaseModel";

function RoomComponent({
  room,
  onModifyRoomList,
  roomListButtonText,
  viewButtonText,
  loggedIn,
  user,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetings,
  images,
}) {
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  function showAlertWithMessage(message) {
    setMessage(message);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  }

  function addToRoomList(room) {
    console.log("Adding to room list:", room);
    onModifyRoomList(room);
    showAlertWithMessage(`${room.name} is in Room Favourites List!`);
  }

  function openPopup() {
    var popup = document.getElementById("popup-menu");
    if (popup) {
      popup.style.display = "block";
    }
  }

  function closePopup() {
    var popup = document.getElementById("popup-menu");
    if (popup) {
      popup.style.display = "none";
    }
  }

  return (
    <div className="room">
      <h3 className="room-header">{room.name}</h3>
      <div
        className="room-front-page"
        style={{
          position: "relative",
          width: "100%",
          height: "300px",
          overflow: "hidden",
          backgroundImage: `url(${images[room.id]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {
          /**
           *  <button
          className="add-to-room-list-button"
          onClick={() => addToRoomList(room)}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "0px",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <h5>{roomListButtonText}</h5>
        </button>
           */
        }
       
        {/**
         *  <button
          onClick={openPopup}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "0px",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        > <h5>{"Getting here"}</h5>
        </button>
         */}
      </div>
      <p>
        Room ID: <b>{room.id}</b> with <b>{room.seats}</b> seats
      </p>
      <p>
        Available: <b>{room.available ? "Yes" : "No"}</b>
      </p>
      {alert && (
        <div className="alert-box">
          <h2>{message}</h2>
        </div>
      )}
      <div id="popup-menu" className="popup-menu" style={{ display: "none" }}>
        <div className="popup-header"></div>
        <div className="popup-content-wrapper">
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>
              ✖
            </button>
            {/*<CalendarInGridView></CalendarInGridView>*/}

            <h2>Copy the invitation to booked time</h2>
          </div>
        </div>
      </div>
      <div class="description">
        <CalendarInGridView
          user={user}
          addMeeting={addMeeting}
          updateMeeting={updateMeeting}
          deleteMeeting={deleteMeeting}
          getMeetings={getMeetings}
          id={room.id}
          name={room.name}
          users={dbUsers}
        />
      </div>
    </div>
  );
}

export default RoomComponent;
