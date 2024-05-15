// NavPresenter.jsx
import { observer } from "mobx-react-lite";
import NavView from "../views/navView";
import React, { useEffect } from "react";
const NavPresenter = observer(({ model }) => {
  useEffect(() => {
     model.doSearch(); // Anropa doSearch för att utföra en initial sökning när komponenten laddas
  }); // Beroendet [model] säkerställer att effekten körs om modellen ändras

  const handleRoomListClicked = () => {
    model.roomListDone.done = true;
    model.getInfoOfArray(model.mediaFavourites);
  };

  const handleLogInOutACB = () => {
    model.logInOrOutWithGoogle();
  };

  const renderLoggedInContent = () => {
    if (model.userState.isLoggedIn) {
      return (
        <>
        {/**
         *         <li>
            <p>
              {model.userState.user.displayName}, {model.userState.user.email}
            </p>
          </li>
          <li>
            <img src={model.userState.user.photoURL} alt="User profile" />
          </li>
         * 
         */}
  
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

  const doSearch = (value) => {
    model.doSearch(value);
  };

  return (
    <NavView
      onSearchButton={doSearch}
      handleResetButtonClick={() => (window.location.hash = "#/")}
      onRoomListClicked={handleRoomListClicked}
      isLoggedIn={model.userState.isLoggedIn}
      query={model.searchParams.q}
      doneSearch={model.searchDone}
      renderLoggedInContent={renderLoggedInContent}
    />
  );
});

export default NavPresenter;
