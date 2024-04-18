// NavPresenter.jsx
import React from "react";
import { observer } from "mobx-react-lite";
import NavView from "../views/navView";

const NavPresenter = observer(({ model }) => {
  const handleRoomListClicked = () => {
    model.roomListDone.done = true;
    model.getInfoOfArray(model.mediaroomList);
  };

  const handleMoreSearchACB = () => {
    model.doMoreSearch();
  };

  const handleLogInOutACB = () => {
    model.logInOrOutWithGoogle();
  };

  const renderLoggedInContent = () => {
    if (model.userState.isLoggedIn) {
      return (
        <>
          <li>
            <p>
              Logged in as: {model.userState.user.displayName},{" "}
              {model.userState.user.email}
            </p>
          </li>
          <li>
            <img src={model.userState.user.photoURL} alt="User profile" />
          </li>
          <li>
            <button onClick={handleLogInOutACB}>
              <h5>Log out</h5>
            </button>
          </li>
        </>
      );
    } else {
      return (
        <li>
          <button onClick={handleLogInOutACB}>
            <h5>Log in with Google</h5>
          </button>
        </li>
      );
    }
  };

  const setSearchQuery = (value) => {
    model.setSearchQuery(value);
  }

  const doSearch = (value) => {
    model.doSearch(value);
  }

  return (
    <NavView
      onSearchQuery={setSearchQuery}
      onSearchButton={doSearch}
      handleResetButtonClick={() => (window.location.hash = "#/")}
      onHandleroomListClicked={handleRoomListClicked}
      isLoggedIn={model.userState.isLoggedIn}
      query={model.searchParams.q}
      doneSearch={model.searchDone}
      renderLoggedInContent={renderLoggedInContent}
    />
  );
});

export default NavPresenter;
