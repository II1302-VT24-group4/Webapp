import HomeView from "../views/homeView";
import { observer } from "mobx-react-lite";

export default function HomePresenter(props) {
  if (!props.model.searchDone.done) {
    window.location.hash = "#/";
  }

  function addToFavoritesACB(room) {
    props.model.saveToroomList(room);
  }
  if (
    !props.model.searchResultsPromiseState.data &&
    !props.model.searchResultsPromiseState.error
  )
    return (
      <div class="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif"></img>
      </div>
    );

  if (props.model.searchResultsPromiseState.error)
    return <div>{props.model.searchResultsPromiseState.error}</div>;

  if (props.model.searchResultsPromiseState.data) props.model.getRooms();
  return (
    <HomeView
      onModifyroomList={addToFavoritesACB}
      images={props.model.imageHolder}
      rooms={props.model.typeList}
      query={props.model.currentQuery}
      alertMessage={props.model.isalertMessage}
      showAlert={props.model.isshowAlert}
      pages={props.model.amountOfPages}
      loggedIn={props.model.userState.isLoggedIn}
    />
  );
}
