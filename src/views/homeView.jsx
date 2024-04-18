import { renderCategory } from "./RoomCategoryRenderer";

export default function HomeView(props) {
  let roomListButtonText = "Add to my rooms";
  let viewButtonText = "Open this room";

  function scrollToCategoryRoom(categoryId) {
    const element = document.getElementById(categoryId);
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

  function onModifyroomListACB(room) {
    props.onModifyroomList(room);
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
      <div className="scroll-to-new-results">
        <h3>Scroll to a specific office</h3>
        <div className="buttons-scroll-to-new-results">
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

      <h2>Search page</h2>
      <h3>
        Search for "{props.query}". Showing {totalRoomsCount()} rooms
      </h3>
      {generateButton()}

      {Object.entries(props.rooms).map(
        ([categoryName, rooms]) =>
          rooms.length > 0 &&
          renderCategory({
            rooms,
            categoryName,
            roomListButtonText,
            viewButtonText,
            showAlert: props.showAlert,
            alertMessage: props.alertMessage,
            images: props.images,
            onViewACB,
            onModifyroomListACB,
            loggedIn: props.loggedIn,
          })
      )}

      <button onClick={scrollToTop} className="scroll-to-top-button">
        ↑
      </button>
    </main>
  );
}
