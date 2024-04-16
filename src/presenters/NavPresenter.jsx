import NavView from "../views/navView.jsx";
import { observer } from "mobx-react-lite";

export default function navViewPresenter(props) {
  function handleroomListClicked() {
    props.model.roomListDone.done = true;
    props.model.getInfoOfArray(props.model.mediaroomList);
  }
  function handleSearchQueryACB(query) {
    props.model.setSearchQuery(query);
  }
  function handleSearchButtonACB() {
    props.model.doSearch();
  }
  function handleLogInOutACB() {
    props.model.logInOrOutWithGoogle();
  }
  function handleMoreSearchACB() {
    props.model.doMoreSearch();
  }

  function getMoreSearchAmount() {
    let moreSearch;

    if (props.model.getMaxResults() != null)
      moreSearch = props.model.getMaxResults() + " sidor återstår att visas";
    else moreSearch = "";
    return moreSearch;
  }
  function checkSearchAvailable() {
    if (
      !props.model.searchResultsPromiseState?.data ||
      props.model.getMaxResults() <= 0
    )
      return true;
    else return false;
  }
  return (
    <NavView
      onSearchQuery={handleSearchQueryACB}
      onSearchButton={handleSearchButtonACB}
      onLogInLogOut={handleLogInOutACB}
      onMoreSearch={handleMoreSearchACB}
      isLoggedIn={props.model.userState.isLoggedIn}
      user={props.model.userState.user}
      query={props.model.searchParams.q}
      moreSearchAmount={getMoreSearchAmount()}
      searchAvailable={checkSearchAvailable()}
      hasSearched={props.model.searchResultsPromiseState.data}
      onHandleroomListClicked={handleroomListClicked}
      rooms={props.model.typeList}
      navOpen={props.model.isnavOpen}
      SearchIconActive={props.model.isSearchIconActive}
      doneSearch={props.model.searchDone}
    />
  );
}
