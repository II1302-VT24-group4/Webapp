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
}) {
  function getCategoryDisplayName(categoryName) {
    return categoryName; // Already in correct format
  }

  const displayName = getCategoryDisplayName(categoryName);

  return (
    <>
      <h3>{displayName}</h3>
      <div className="rooms" id={categoryName.toLowerCase()}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomComponent
              room={room}
              onModifyRoomList={onModifyRoomListACB}
              images={images}
              roomListButtonText={roomListButtonText}
              alertMessage={alertMessage}
              showAlert={showAlert}
              loggedIn={loggedIn}
            />
          ))
        ) : (
          <p>No rooms in the office {displayName}.</p>
        )}
      </div>
    </>
  );
}
