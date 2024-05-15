import React from "react";
import { renderCategory } from "./RoomCategoryRenderer";

export default function RoomFavouriteListView(props) {
  function onModifyRoomListACB(room) {
    props.onModifyRoomList(room);
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const officeList2 = props.officeList2 || {}; 

  return (
    <main>
      <div className="Alert_content">
        {props.showAlert?.alert && (
          <div className="alert-box">
            <p>{props.alertMessage.message}</p>
          </div>
        )}
      </div>
      <h2>Favourites</h2>
      {Object.entries(officeList2).map(([officeName, rooms]) =>
        rooms.length > 0 ? (
          renderCategory({
            rooms,
            categoryName: officeName,
            roomListButtonText: "Remove from my favourites",
            viewButtonText: "Open Schedule",
            showAlert: props.showAlert,
            alertMessage: props.alertMessage,
            images: props.images,
            onModifyRoomListACB: onModifyRoomListACB,
            loggedIn: props.loggedIn,
            user: props.user,
          })
        ) : (
          <div className="no-rooms">
            <p>No rooms available in {officeName}.</p>
          </div>
        )
      )}
      <button onClick={scrollToTop} className="scroll-to-top-button">
        ↑
      </button>
    </main>
  );
}
