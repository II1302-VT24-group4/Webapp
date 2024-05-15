import React, { useEffect } from "react";
import RoomFavouriteListView from "/src/views/RoomFavouriteListView.jsx";
import { observer } from "mobx-react-lite";
import { db } from "/src/firebaseModel";

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

  async function fetchDocumentsByIds(collectionPath, ids) {
    const batch = db.batch();

    const fetchedDocs = [];

    ids.forEach(id => {
        const docRef = doc(db, collectionPath, id);
        batch.get(docRef);
    });

    const batchResult = await batch.commit();

    batchResult.forEach(docSnapshot => {
        if (docSnapshot.exists()) {
            fetchedDocs.push({
                id: docSnapshot.id,
                ...docSnapshot.data()
            });
        }
    });

    return fetchedDocs;
}
 console.log(props.model.mediaFavourites.length);
  if(props.model.mediaFavourites.length){
    
    const favouriteRooms = fetchDocumentsByIds("rooms", props.model.mediaFavourites);
    console.log(favouriteRooms);

  }
  console.log(props.model.mediaFavourites);
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
      favourites={favouriteRooms}
    />
  );
});
