import { update } from "firebase/database";
import RoomComponent from "/src/views/RoomComponent.jsx";

export function renderCategory({
  rooms,
  categoryName,
  roomListButtonText,
  showAlert,
  alertMessage,
  images,
  onModifyRoomListACB,
  loggedIn,
  viewButtonText,
  user,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetings,
}) {
  function getCategoryDisplayName(categoryName) {
    console.log(categoryName);
    return categoryName;
  }

  const displayName = getCategoryDisplayName(categoryName);

  return (
    <>
      <h3>
        <b>{displayName}</b>{" "}
      </h3>
      <div class="rooms" id={categoryName.toLowerCase()}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomComponent
              room={room}
              onModifyRoomList={onModifyRoomListACB}
              images={images}
              roomListButtonText={roomListButtonText}
              viewButtonText={viewButtonText}
              alertMessage={alertMessage}
              showAlert={showAlert}
              loggedIn={loggedIn}
              user={user}
              addMeeting={addMeeting}
              updateMeeting={updateMeeting}
              deleteMeeting={deleteMeeting}
              getMeetings={getMeetings}
            />
          ))
        ) : (
          <p>No rooms in the office {displayName}.</p>
        )}
      </div>
    </>
  );
}
