import MyCalendarView from "./myCalendarView";

function RoomComponent({
  room,
  onModifyRoomList,
  images,
  roomListButtonText,
  viewButtonText,
  alertMessage,
  showAlert,
  loggedIn,
  user,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetings
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
  function closePopup() {
    var popup = document.getElementById("popup-menu");
    if (popup) {
      popup.style.display = "none";
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

  function addToRoomList(room) {
    console.log("Adding to room list:", room);
    onModifyRoomList(room);
    showAlertWithMessage(roomListButtonText + " performed!");
  }

  function renderCitation(style) {
    //Inbjudan till en bokning
    let citation = "";
    const currentDate = new Date();
    const formattedDate = "1 februari";
    //const formattedDate =
    //  currentDate.getFullnonFormattedDate() +
    //  "-" +
    //  ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    //  "-" +
    //  ("0" + currentDate.getDate()).slice(-2);

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
        citation = "Invitation style not selected";
    }
    return citation;
  }
  return (
    <div class="room">
      <div class="room-front-page">
        <img
          src={images[room.id]}
          alt={`Bild för ${room.name}`}
          style={{ maxWidth: "100%" }}
        />

        <h4 class="room-header">{room.name}</h4>

        <button onClick={() => addToRoomList(room)}>
          <h5>{roomListButtonText}</h5>
        </button>
        <button onClick={openPopup}>
          <h5>{viewButtonText}</h5>{" "}
        </button>
      </div>
      <div id="popup-menu" class="popup-menu" style={{ display: "none" }}>
        <div class="popup-header"></div>
        <div class="popup-content-wrapper">
          <div class="popup-content">
            <button class="close-button" onClick={closePopup}>
              ✖
            </button>
            {/*<MyCalendarView></MyCalendarView>*/}

            <h2>Copy the invitation to booked time</h2>
            <div class="citation-style">
              <h3>Booking</h3>
              <p>{renderCitation("Harvard")}</p>
              <button
                class="copy-button"
                onClick={() =>
                  copyToClipboard(renderCitation("Harvard"), "Harvard")
                }
              >
                <p>Copy</p>
              </button>
            </div>
            {showAlert.value && (
              <div class="alert-box">
                <h1>{alertMessage.value}</h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <p>ID: {room.id}</p>
      <p>Seats: {room.seats}</p>
      <p>Available: {room.available}</p>
      <div class="description">
        <MyCalendarView 
          user={user}
          addMeeting={addMeeting}
          updateMeeting={updateMeeting}
          deleteMeeting={deleteMeeting}
          getMeetings={getMeetings}
          room={room.id}
        />
      </div>
    </div>
  );
}

export default RoomComponent;
