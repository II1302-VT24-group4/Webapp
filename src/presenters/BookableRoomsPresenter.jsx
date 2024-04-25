import { observer } from "mobx-react-lite";
import BookableRoomsView from "/src/views/BookableRoomsView";
import { useEffect } from "react";

export default observer(function BookableRoomsPresenter(props) {

  useEffect(() => {
    if (props.model.searchResultsPromiseState.data) {
      props.model.getRooms();
    }
  }, [props.model.searchResultsPromiseState.data]);


  if (!props.model.searchDone.done) {
    return (
      <div class="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif" alt="Loading" />
      </div>
    );
  }
  function addToFavouritesACB(room) {
    props.model.modifyFavourites(room, true);
  }

  return (
    <BookableRoomsView
      onModifyRoomList={addToFavouritesACB}
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
