//EVENTUELLT EGEN SIDA FÖR FAVORITMARKERADE RUM!

import { renderCategory } from "./RoomCategoryRenderer";

export default function RoomFavouriteListView(props) {
  const roomListButtonText = "Ta bort från favoriter";
  const viewButtonText = "Öppna artikel";

  function onModifyRoomListACB(room) {
    props.onModifyroomList(room);
  }

  function onModifyViewedACB(room) {
    window.open(room.meetingLink, "_blank");
  }

  return (
    <main>
      {props.showAlert?.alert && (
        <div className="alert-box">
          <h2>{props.alertMessage.message}</h2>
        </div>
      )}
      <h2>Favourites</h2>
      {Object.entries(props.rooms).map(([categoryName, rooms]) =>
        renderCategory({
          rooms,
          categoryName,
          roomListButtonText,
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
