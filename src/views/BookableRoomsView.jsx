import React, { useState } from "react";
import { renderCategory } from "./RoomCategoryRenderer";
import { dbUsers } from "/src/firebaseModel";

export default function BookableRoomsView(props) {
  const [isGridViewActive, setIsGridViewActive] = useState(false);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);

  console.log(props.users);

  function scrollToCategoryRoom(categoryId) {
    const lowerCaseCategoryId = categoryId.toLowerCase();
    const element = document.getElementById(lowerCaseCategoryId);
    if (element) {
      element.scrollIntoView();
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function onModifyRoomListACB(room) {
    props.onModifyRoomList(room);
  }

  function onViewACB(room) {
    window.open(room.meetingLink, "_blank");
  }

  function totalRoomsCount() {
    return Object.values(props.rooms).reduce((total, rooms) => {
      const filteredRooms = rooms.filter(
        (room) => !showAvailableRooms || room.available
      );
      return total + filteredRooms.length;
    }, 0);
  }

  function generateButton() {
    return (
      <div class="scroll-to-specific-office-div">
        <div class="scroll-to-specific-office">
          {Object.keys(props.rooms).map((officeKey) => (
            <button
              key={officeKey}
              onClick={() => scrollToCategoryRoom(officeKey)}
            >
              <h5>{officeKey.replace("office", "")}</h5>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="Alert_content">
        {props.showAlert?.alert && (
          <div className="alert-box">
            <p>{props.alertMessage.message}</p>
          </div>
        )}
      </div>

      <h2>Book by specific room</h2>

      <h3>
        Search for "{props.query}". Showing {totalRoomsCount()} rooms. The
        buttons below scroll to an office.
      </h3>
      <div className="filter-checkbox">
        <label>
          <input
            type="checkbox"
            checked={showAvailableRooms}
            onChange={(e) => setShowAvailableRooms(e.target.checked)}
          />
        </label>
        <h3>Only show currently available rooms</h3>
      </div>
      {generateButton()}

      {Object.entries(props.rooms).map(
        ([categoryName, rooms]) =>
          rooms.filter((room) => !showAvailableRooms || room.available).length >
            0 &&
          renderCategory({
            rooms: rooms.filter(
              (room) => !showAvailableRooms || room.available
            ),
            categoryName,
            roomListButtonText: "Add to Favourites",
            viewButtonText: "Open Schedule",
            showAlert: props.showAlert,
            alertMessage: props.alertMessage,
            images: props.images,
            onViewACB,
            onModifyRoomListACB,
            loggedIn: props.loggedIn,
            user: props.user,
            addMeeting: props.addMeeting,
            updateMeeting: props.updateMeeting,
            deleteMeeting: props.deleteMeeting,
            getMeetings: props.getMeetings,
          })
      )}

      {isGridViewActive && (
        <>
          <button
            onClick={() => console.log("Previous Day")}
            className="control-button"
          >
            <h5>Previous Day</h5>
          </button>
          <button
            onClick={() => console.log("Next Day")}
            className="control-button"
          >
            <h5>Next Day</h5>
          </button>
        </>
      )}

      <button onClick={scrollToTop} className="scroll-to-top-button">
        ↑
      </button>
    </main>
  );
}
