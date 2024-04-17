import { renderCategory } from "./RoomCategoryRenderer";

export default function HomeView(props) {
  let roomListButtonText = "Add to my rooms";
  let viewedButtonText = "Open this room";

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
    return Object.values(props.rooms).reduce(
      (total, category) => total + category.length,
      0
    );
  }
  function generateButton() {
    return (
      <div class="scroll-to-new-results">
        <h3>Se nyladdade resultat med ett knapptryck</h3>
        <div class="buttons-scroll-to-new-results">
          <button
            onClick={() => scrollToCategoryArticle(props.pages + "office1")}
          >
            <h5>Stockholm</h5>
          </button>
          <button
            onClick={() => scrollToCategoryArticle(props.pages + "office2")}
          >
            <h5>Göteborg</h5>
          </button>
          <button
            onClick={() => scrollToCategoryArticle(props.pages + "office3")}
          >
            <h5>Malmö</h5>
          </button>
          <button
            onClick={() => scrollToCategoryArticle(props.pages + "office4")}
          >
            <h5>Uppsala</h5>
          </button>
          <button
            onClick={() => scrollToCategoryArticle(props.pages + "office5")}
          >
            <h5>Västerås</h5>
          </button>
          <button
            onClick={() => scrollToCategoryArticle(props.pages + "office6")}
          >
            <h5>Örebro</h5>
          </button>
          <button
            onClick={() => scrollToCategoryArticle(props.pages + "other")}
          >
            <h5>Other offices</h5>
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
