import React, { useEffect } from "react";
import RoomFavouriteListView from "/src/views/RoomFavouriteListView.jsx";
import { observer } from "mobx-react-lite";
import { db } from "/src/firebaseModel";
import { doc, getDoc } from "firebase/firestore"; // Import doc and getDoc

export default observer(function RoomFavouriteListPresenter(props) {
  
  function removeFromFavouritesACB(room) {
    props.model.modifyFavourites(room, false);
  }

  useEffect(() => {}, [props.model.mediaFavourites]); //varför funkar det inte???

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
      rooms={props.model.mediaFavourites}
      query={props.model.currentQuery}
      alertMessage={props.model.isAlertMessage}
      showAlert={props.model.isShowAlert}
      loggedIn={props.model.userState.isLoggedIn}
      office={props.model.office}
      favourites={props.model.favouriteRooms}
    />
  );
});
