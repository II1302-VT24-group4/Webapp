import roomListView from "/src/views/roomListView.jsx";
import { observer } from "mobx-react-lite";

export default function roomListPresenter(props) {
  if (!props.model.roomListDone.done) {
    window.location.hash = "#/";
  }

  function removeFromFavouritesACB(room) {
    props.model.removeFromFavourites(room);
  }

  if (!props.model.favHistReady.ready)
    return (
      <div class="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif"></img>
      </div>
    );
  else {
    return (
      <roomListView
        onModifyRoomList={removeFromFavouritesACB}
        images={props.model.favHistimageHolder}
        rooms={props.model.favHistOfficeList}
        alertMessage={props.model.isAlertMessage}
        showAlert={props.model.isShowAlert}
      />
    );
  }
}
