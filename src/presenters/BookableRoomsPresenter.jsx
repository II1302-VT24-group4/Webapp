import { observer } from "mobx-react-lite";
import BookableRoomsView from "/src/views/BookableRoomsView";
import { useEffect } from "react";

export default observer(function BookableRoomsPresenter(props) {
  // Kontrollera om sökningen är klar men inga resultat finns
  useEffect(() => {
    if (
      props.model.searchDone.done &&
      props.model.searchResultsPromiseState.data &&
      props.model.searchResultsPromiseState.data.items.length === 0
    ) {
      //inga resultat
    }
  }, [props.model.searchDone.done, props.model.searchResultsPromiseState.data]);

  function addToFavoritesACB(room) {
    props.model.modifyFavourites(room, true);
  }

  // Hantering av laddningsstatus eller när data inte finns tillgängliga
  if (
    !props.model.searchResultsPromiseState.data &&
    !props.model.searchResultsPromiseState.error
  ) {
    //window.location.hash = "#/home"; // Omdirigera till Home
    return (
      <div class="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif" alt="Loading" />
      </div>
    );
  }

  // Felhantering
  if (props.model.searchResultsPromiseState.error) {
    return <div>{props.model.searchResultsPromiseState.error}</div>;
  }

  // Om det finns data, bearbeta rummen
  if (props.model.searchResultsPromiseState.data) {
    props.model.getRooms();
  }

  return (
    <BookableRoomsView
      onModifyRoomList={addToFavoritesACB}
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
