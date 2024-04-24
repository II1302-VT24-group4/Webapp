import RoomFavouriteListView from "/src/views/roomFavouriteListView.jsx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export default observer(function RoomFavouriteListPresenter(props) {
  //if (!props.model.roomListDone.done) {
  //   window.location.hash = "#/";
  //}

  //Hela promise-delen kanske inte är relevant då detta handlar om lokalt lagrade favoriter? - Jo, men de hämtas från firebase
  function removeFromFavouritesACB(room) {
    props.model.removeFromFavourites(room);
  }

  useEffect(() => {
    //if (!props.model.searchDone) {
    //  props.model.doSearch("");
    //}
  }, [props.model]);

  useEffect(() => {
    if (props.model.searchResultsPromiseState.data) {
      props.model.getRooms();
    }
  }, [props.model.searchResultsPromiseState.data]);

  if (!props.model.roomListDone) {
    return (
      <div class="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif" alt="Loading" />
      </div>
    );
  }
  return (
    <RoomFavouriteListView
      onModifyRoomList={removeFromFavouritesACB}
      images={props.model.imageHolder}
      rooms={props.model.officeList}
      query={props.model.currentQuery}
      alertMessage={props.model.isAlertMessage}
      showAlert={props.model.isShowAlert}
      loggedIn={props.model.userState.isLoggedIn}
      office={props.model.office}
    />
  );
});
