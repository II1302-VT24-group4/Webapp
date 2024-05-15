import React, { useEffect } from "react";
import RoomFavouriteListView from "/src/views/RoomFavouriteListView.jsx";
import { observer } from "mobx-react-lite";
import { db } from "/src/firebaseModel";
import { doc, getDoc } from "firebase/firestore"; // Import doc and getDoc

export default observer(function RoomFavouriteListPresenter(props) {
  function removeFromFavouritesACB(room) {
    props.model.modifyFavourites(room, false);
  }

  useEffect(() => {
    if (props.model.searchResultsPromiseState.data) {
      props.model.getRooms();
    }
  }, [props.model.searchResultsPromiseState.data]);

  if (!props.model.roomListDone) {
    return (
      <div className="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif" alt="Loading" />
      </div>
    );
  }

  return (
    <RoomFavouriteListView
      onModifyRoomList={removeFromFavouritesACB}
      images={props.model.imageHolder}
      rooms={props.model.favouriteRooms}
      query={props.model.currentQuery}
      alertMessage={props.model.isAlertMessage}
      showAlert={props.model.isShowAlert}
      loggedIn={props.model.userState.isLoggedIn}
      officeList2={props.model.officeList2}
      favourites={props.model.favouriteRooms}
    />
  );
});
