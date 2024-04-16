import { renderCategory } from "./RoomCategoryRenderer";

export default function HomeView(props) {
  let roomListButtonText = "Lägg i favoriter";
  let viewedButtonText = "Öppna artikel";
  let lastTextId = props.pages + "text";

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
    //SKA DET VARA EN ACB?
    window.open(room.meetingLink, "_blank");
  }

  function totalRoomsCount() {
    return props.rooms.text.length;
  }

  function generateButton() {
    return (
      <div className="scroll-to-new-results">
        <h3>Se nyladdade resultat med ett knapptryck</h3>
        <div className="buttons-scroll-to-new-results">
          <button onClick={() => scrollToCategoryRoom(lastTextId)}>
            <h5>Text</h5>
          </button>
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

      <h2>Söksida</h2>
      <h3>
        Sökning "{props.query}", sidan visar {totalRoomsCount()} textartiklar
      </h3>
      {generateButton()}

      {props.rooms.text.length > 0 &&
        renderCategory({
          rooms: props.rooms.text,
          categoryName: "text",
          roomListButtonText,
          viewedButtonText,
          showAlert: props.showAlert,
          alertMessage: props.alertMessage,
          images: props.images,
          onViewACB,
          onModifyroomListACB,
          loggedIn: props.loggedIn,
        })}

      <button onClick={scrollToTop} className="scroll-to-top-button">
        ↑
      </button>
    </main>
  );
}
