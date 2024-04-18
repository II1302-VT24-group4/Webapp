import HomeView from "../views/HomeView";
import { observer } from "mobx-react-lite";

export default observer(function HomePresenter(props) {
  /*if (!props.model.searchDone.done) {
    window.location.hash = "#/";
  }*/
  function addToFavoritesACB(room) {
    props.model.saveToroomList(room);
  }
  if (
    !props.model.searchResultsPromiseState.data &&
    !props.model.searchResultsPromiseState.error
  ) {
    return (
      <div className="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif"></img>
      </div>
    );
  }

  if (props.model.searchResultsPromiseState.error)
    return <div>{props.model.searchResultsPromiseState.error}</div>;

  if (props.model.searchResultsPromiseState.data) props.model.getRooms();
  return (
    <HomeView
      onModifyroomList={addToFavoritesACB}
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
