import React, { useState } from "react";
import { renderCategory } from "./RoomCategoryRenderer";
import {dbUsers} from "/src/firebaseModel";


export default function BookableRoomsView(props) {
  const [isGridViewActive, setIsGridViewActive] = useState(false);

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
    return Object.values(props.rooms).reduce(
      (total, category) => total + category.length,
      0
    );
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
      <div class="Alert_content">
        {props.showAlert?.alert && (
          <div class="alert-box">
            <p>{props.alertMessage.message}</p>
          </div>
        )}
      </div>

      <h2>Book by specific room</h2>

      <h3>
        Search for "{props.query}". Showing {totalRoomsCount()} rooms. The
        buttons below scroll to an office.
      </h3>

      {generateButton()}

      {Object.entries(props.rooms).map(
        ([categoryName, rooms]) =>
          rooms.length > 0 &&
          renderCategory({
            rooms,
            categoryName,
            roomListButtonText: "Add to my rooms",
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
            class="control-button"
          >
            <h5>Previous Day</h5>
          </button>
          <button
            onClick={() => console.log("Next Day")}
            class="control-button"
          >
            <h5>Next Day</h5>
          </button>
        </>
      )}

      <button onClick={scrollToTop} class="scroll-to-top-button">
        ↑
      </button>
    </main>
  );
}
