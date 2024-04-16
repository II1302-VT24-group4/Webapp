import React from "react";
import NavView from "../views/navView.jsx";
import { observer } from "mobx-react-lite";

const NavViewPresenter = observer(({ model }) => {
  const handleRoomListClicked = () => {
    model.roomListDone.done = true;
    model.getInfoOfArray(model.mediaroomList);
  };

  const handleSearchQueryACB = (query) => {
    model.setSearchQuery(query);
  };

  const handleSearchButtonACB = () => {
    model.doSearch();
  };

  const handleLogInOutACB = () => {
    model.logInOrOutWithGoogle();
  };

  const handleMoreSearchACB = () => {
    model.doMoreSearch();
  };

  const getMoreSearchAmount = () => {
    if (model.getMaxResults() != null) {
      return `${model.getMaxResults()} sidor återstår att visas`;
    } else {
      return "";
    }
  };

  const checkSearchAvailable = () => {
    return !model.searchResultsPromiseState?.data || model.getMaxResults() <= 0;
  };

  return (
    <NavView
      onSearchQuery={handleSearchQueryACB}
      onSearchButton={handleSearchButtonACB}
      onLogInLogOut={handleLogInOutACB}
      onMoreSearch={handleMoreSearchACB}
      isLoggedIn={model.userState.isLoggedIn}
      user={model.userState.user}
      query={model.searchParams.q}
      moreSearchAmount={getMoreSearchAmount()}
      searchAvailable={checkSearchAvailable()}
      hasSearched={model.searchResultsPromiseState.data}
      onHandleroomListClicked={handleRoomListClicked}
      rooms={model.typeList}
      navOpen={model.isnavOpen}
      SearchIconActive={model.isSearchIconActive}
      doneSearch={model.searchDone}
    />
  );
});

export default NavViewPresenter;
