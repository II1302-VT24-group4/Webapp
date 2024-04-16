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
    const nameMap = {
      office1: "Stockholm",
      office2: "Göteborg",
      office3: "Malmö",
      office4: "Uppsala",
      office5: "Västerås",
      office6: "Örebro",
      other: "Other offices",
    };
    return nameMap[categoryName] || categoryName;
  }

  const displayName = getCategoryDisplayName(categoryName);

  return (
    <>
      <h3>{displayName}</h3>
      <div class="rooms" id={categoryName.toLowerCase()}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomComponent
              room={room}
              onModifyroomList={onModifyRoomListACB}
              images={images}
              roomListButtonText={roomListButtonText}
              alertMessage={alertMessage}
              showAlert={showAlert}
              loggedIn={loggedIn}
            />
          ))
        ) : (
          <p>Du saknar rum inom byggnaden {displayName}.</p>
        )}
      </div>
    </>
  );
}
