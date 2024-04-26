import { observer } from "mobx-react-lite";
import MeetingView from "/src/views/MeetingView.jsx";
import { useEffect } from "react";

export default observer(function MeetingPresenter(props) {
  useEffect(() => {
    if (props.model.searchResultsPromiseState.data) {
      //props.model.getRooms(); Göra något automatiskt när state ändras?
    }
  }, [props.model.searchResultsPromiseState.data]);

  /*
  if (!props.model.searchDone.done) { //vänta på att något är klart?
    return (
      <div class="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif" alt="Loading" />
      </div>
    );
  }
  function addToFavouritesACB(room) {
    props.model.modifyFavourites(room, true);
  }
  */

  return (
    <MeetingView
      //onModifyRoomList={addToFavouritesACB}
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
