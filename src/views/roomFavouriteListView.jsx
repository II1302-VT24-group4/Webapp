//EVENTUELLT EGEN SIDA FÖR FAVORITMARKERADE RUM!

import { renderCategory } from "./RoomCategoryRenderer";

export default function RoomFavouriteListView(props) {
  const roomListButtonText = "Remove from my rooms";
  const viewButtonText = "Open schedule";

  function onModifyRoomListACB(room) {
    props.onModifyRoomList(room);
  }

  function onModifyViewedACB(room) {
    window.open(room.meetingLink, "_blank");
  }

  return (
    <main>
      {props.showAlert?.alert && (
        <div class="alert-box">
          <h2>{props.alertMessage.message}</h2>
        </div>
      )}
      <h2>Favourites</h2>
      {Object.entries(props.rooms).map(([categoryName, rooms]) =>
        renderCategory({
          rooms,
          categoryName,
          roomListButtonText,
          viewButtonText,
          showAlert: props.showAlert,
          alertMessage: props.alertMessage,
          images: props.images,
          onModifyViewedACB,
          onModifyRoomListACB,
        })
      )}
    </main>
  );
}
