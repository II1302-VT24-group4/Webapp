import roomListView from "/src/views/roomListView.jsx";
import { observer } from "mobx-react-lite";

export default function roomListPresenter(props) {
  if (!props.model.roomListDone.done) {
    window.location.hash = "#/";
  }

  //Hela promise-delen kanske inte är relevant då detta handlar om lokalt lagrade favoriter? - Jo, men de hämtas från firebase
  function removeFromFavoritesACB(room) {
    props.model.removeFromFavourites(room);
  }
  function removeFromFavoritesACB(room) {
    props.model.modifyFavourites(room, false);
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
        onModifyRoomList={removeFromFavoritesACB}
        images={props.model.favHistimageHolder}
        rooms={props.model.favHistOfficeList}
        alertMessage={props.model.isAlertMessage}
        showAlert={props.model.isShowAlert}
      />
    );
  }
}
