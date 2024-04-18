function RoomComponent({
  room,
  onModifyRoomList,
  images,
  roomListButtonText,
  alertMessage,
  showAlert,
  loggedIn,
}) {
  let loggedInVal = true;

  if (loggedIn !== undefined) {
    loggedInVal = loggedIn;
  }
  function showAlertWithMessage(message) {
    alertMessage.message = message;
    showAlert.alert = true;

    setTimeout(() => {
      showAlert.alert = false;
    }, 1500);
  }

  function openPopup() {
    var popup = document.getElementById("popup-menu");
    if (popup) {
      popup.style.display = "block";
    }
  }

  function truncateString(str, num) {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  function copyToClipboard(text, citationStyle) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showAlertWithMessage(`${citationStyle} copied!`);
      })
      .catch((err) => {
        showAlertWithMessage("Text was not copied");
      });
  }

  function addToroomList(room) {
    onModifyRoomList(room);
    showAlertWithMessage(`${roomListButtonText} performed!`);
  }

  function closePopup() {
    var popup = document.getElementById("popup-menu");
    if (popup) {
      popup.style.display = "none";
    }
  }
  function renderCitation(style) {
    //Inbjudan till en bokning
    let citation = "";
    const currentDate = new Date();
    const formattedDate =
      currentDate.getFullnonFormattedDate() +
      "-" +
      ("0" + (currentDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + currentDate.getDate()).slice(-2);

    const authorText = room.author || "Okänd författare";
    switch (style) {
      case "Style1":
        citation =
          authorText +
          " (" +
          room.nonFormattedDate +
          "). " +
          room.title +
          ". [online] Tillgänglig på: " +
          room.meetingLink +
          " [Tillgångsdatum: " +
          formattedDate +
          "].";
        break;
      case "Style2":
        citation =
          authorText +
          ", '" +
          room.title +
          "', " +
          room.nonFormattedDate +
          ", [online], Tillgänglig på: " +
          room.meetingLink +
          " [Tillgångsdatum: " +
          formattedDate +
          "].";
        break;
      case "Style3":
        citation =
          authorText +
          ". " +
          room.title +
          " [Internet]. " +
          room.nonFormattedDate +
          " [Tillgångsdatum: " +
          formattedDate +
          "]; Tillgänglig från: " +
          room.meetingLink;
        break;
      default:
        citation = "Inbjudningsstil ej vald";
    }
    return citation;
  }
  return (
    <div className="room">
      <div className="room-front-page">
        <img
          src={images[room.id]}
          alt={`Bild för ${room.name}`}
          style={{ maxWidth: "100%" }}
        />
        <h4 className="room-header">{room.name}</h4>
        {loggedInVal && (
          <button onClick={() => addToroomList(room)}>
            {roomListButtonText}
          </button>
        )}
      </div>
      <div className="description">
        <p>{room.description}</p>
      </div>
    </div>
  );
}

export default RoomComponent;
