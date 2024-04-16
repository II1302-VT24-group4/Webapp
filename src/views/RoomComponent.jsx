function RoomComponent({
  room,
  onModifyroomList,
  image,
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
        showAlertWithMessage(`${citationStyle}-citering kopierad!`);
      })
      .catch((err) => {
        showAlertWithMessage("Text kopierades inte ");
      });
  }

  function addToroomList(room) {
    onModifyroomList(room);
    showAlertWithMessage(roomListButtonText + " har genomförts!");
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

  return room.id !== "Page Number" ? ( //För flera sidor med rum.
    <div class="room">
      <div class="room-front-page">
        <room class={"id" + room.idNoLink}>
          <div class={room.id}></div>
          <style>
            {`.id${room.idNoLink} {
              background-office3: url(${image[room.id]});
              background-size: 90% 90%; 
              background-position: center center; 
              background-repeat: no-repeat; 
              box-shadow: 0 4px 8px rgba(0, 0, 0, 1);
            }`}
          </style>
          <h4 class="room-header">
            <span class="title">{truncateString(room.title, 40)}</span>
            {room.author && (
              <span class="author-nonFormattedDate">
                <span>{truncateString(room.author, 20)}</span>
                {room.nonFormattedDate && (
                  <span>{" " + room.nonFormattedDate}</span>
                )}
              </span>
            )}
          </h4>
        </room>
      </div>
      <div class="description">
        <div>
          {loggedInVal && (
            <button onClick={() => addToroomList(room)}>
              <h5>{roomListButtonText}</h5>
            </button>
          )}
          <button onClick={openPopup}>
            <h5>Boka</h5>
          </button>
        </div>
        <div>
          <div class="description-text">
            {room.title && <div>{"Room number: " + room.title}</div>}
            {room.summary && <div>{"Sammanfattning: " + room.summary}</div>}
          </div>
        </div>
      </div>
      <div id="popup-menu" class="popup-menu" style={{ display: "none" }}>
        <div class="popup-header"></div>
        <div class="popup-content-wrapper">
          <div class="popup-content">
            <button class="close-button" onClick={closePopup}>
              ✖
            </button>
            <h2>Boka</h2>

            <div class="citation-style">
              <h3>Style1</h3>
              <p>{renderCitation("Style1")}</p>
              <button
                class="copy-button"
                onClick={() =>
                  copyToClipboard(renderCitation("Style1"), "Style1")
                }
              >
                <p>Kopiera</p>
              </button>
            </div>
            <div class="citation-style">
              <h3>Style2</h3>
              <p>{renderCitation("Style2")}</p>
              <button
                class="copy-button"
                onClick={() =>
                  copyToClipboard(renderCitation("Style2"), "Style2")
                }
              >
                <p>Kopiera</p>
              </button>
            </div>
            <div class="citation-style">
              <h3>Style3</h3>
              <p>{renderCitation("Style3")}</p>
              <button
                class="copy-button"
                onClick={() =>
                  copyToClipboard(renderCitation("Style3"), "Style3")
                }
              >
                <p>Kopiera</p>
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
    </div>
  ) : (
    <div class="result-box" id={room.idNoLink}>
      <h4>← Slut på sida. Sida {room.title} →</h4>
    </div>
  );
}

export default RoomComponent;
