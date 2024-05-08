import { renderCategory } from "./RoomCategoryRenderer";
import BookableRoomsPresenter from "/src/presenters/BookableRoomsPresenter";

export default function BookableRoomsView(props) {
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
      <div class="room scroll-to-specific-office">
        <h3>Scroll to a specific office</h3>
        <div class="description scroll-to-specific-office-desp">
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

      <button onClick={scrollToTop} class="scroll-to-top-button">
        ↑
      </button>
    </main>
  );
}
