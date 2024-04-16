import RoomFavouriteListView from "/src/views/roomFavouriteListView.jsx";
import { observer } from "mobx-react-lite";

export default observer( function RoomFavouriteList(props) {
  if (!props.model.roomListDone.done) {
    window.location.hash = "#/";
  }

  //Hela promise-delen kanske inte är relevant då detta handlar om lokalt lagrade favoriter? - Jo, men de hämtas från firebase
  function removeFromFavoritesACB(room) {
    props.model.removeFromroomList(room);
  }
  if (!props.model.favHistReady.ready)
    return (
      <div class="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif"></img>
      </div>
    );
  else {
    return (
      <div>
        {<RoomFavouriteListView
          onModifyroomList={removeFromFavoritesACB}
          images={props.model.favHistimageHolder}
          rooms={props.model.favHistTypeList}
          alertMessage={props.model.isalertMessage}
          showAlert={props.model.isshowAlert}
        />}
      </div>
    );
  }
});