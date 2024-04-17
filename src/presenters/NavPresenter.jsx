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
            <p>Inloggad som: {model.userState.user.displayName}, {model.userState.user.email}</p>
          </li>
          <li>
            <img src={model.userState.user.photoURL} alt="Användarens profil" />
          </li>
          <li>
            <button onClick={handleLogInOutACB}>
              <h5>Logga ut</h5>
            </button>
          </li>
        </>
      );
    } else {
      return (
        <li>
          <button onClick={handleLogInOutACB}>
            <h5>Logga in med Google</h5>
          </button>
        </li>
      );
    }
  };

  const renderMoreSearch = () => {
    if (model.searchResultsPromiseState?.data) {
      return (
        <>
          <li>
            <button onClick={handleMoreSearchACB} disabled={!model.getMaxResults()}>
              <h5>Visa ytterligare en sida</h5>
            </button>
          </li>
          <li>
            <p>Totalt {model.searchResultsPromiseState.data.totalItems} resultat</p>
            <p>{model.getMaxResults()} sidor återstår att visas</p>
          </li>
        </>
      );
    }
  };

  return (
    <NavView
      onSearchQuery={model.setSearchQuery}
      onSearchButton={model.doSearch}
      handleResetButtonClick={() => window.location.hash = "#/"}
      onHandleroomListClicked={handleRoomListClicked}
      isLoggedIn={model.userState.isLoggedIn}
      query={model.searchParams.q}
      doneSearch={model.searchDone}
      renderLoggedInContent={renderLoggedInContent}
      renderMoreSearch={renderMoreSearch}
    />
  );
});

export default NavPresenter;
