import React, { useState } from "react";
import { renderCategory } from "./RoomCategoryRenderer";

export default function RoomFavouriteListView(props) {
  // Hanterar läggning och borttagning av rum från favoriter
  function onModifyRoomListACB(room) {
    props.onModifyRoomList(room);
  }
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <h2>Favourites</h2>
      {/*

      {Object.entries(props.rooms).map(
        ([categoryName, rooms]) =>
          rooms.length > 0 &&
          renderCategory({
            rooms,
            categoryName,
            roomListButtonText: "Remove from my rooms",
            viewButtonText: "Open schedule",
            showAlert: showAlert,
            alertMessage: alertMessage,
            images: props.images,
            onModifyViewedACB: (room) =>
              window.open(room.meetingLink, "_blank"),
            onModifyRoomListACB: handleModifyRoomList,
            loggedIn: props.loggedIn,
          })
      )}
*/}

      {Object.entries(props.rooms).map(
        ([categoryName, rooms]) =>
          rooms.length > 0 &&
          renderCategory({
            rooms,
            categoryName,
            roomListButtonText: "Remove from my rooms",
            viewButtonText: "Open Schedule",
            showAlert: props.showAlert,
            alertMessage: props.alertMessage,
            images: props.images,
            onModifyRoomListACB,
            loggedIn: props.loggedIn,
            user: props.user,
          })
      )}
      <button onClick={scrollToTop} class="scroll-to-top-button">
        ↑
      </button>
    </main>
  );
}
