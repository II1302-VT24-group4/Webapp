import React from "react";

export default function NavView(props) {
  // Event Handlers

  // Handles changes in the search input
  const handleSearchACB = (event) => {
    props.onSearchQuery(event.target.value);
  };

  // Handles search action when Enter key is pressed
  const handleSearchDoingACB = (event) => {
    if (event.key === "Enter") {
      props.onSearchButton();
      window.location.hash = "#/search";
    }
  };

  // Handles navigation to the welcome page
  const handleResetButtonClick = () => {
    window.location.hash = "#/";
  };

  // Handles showing more search results
  const handleMoreSearchACB = () => {
    if (window.location.hash !== "#/search") {
      window.location.hash = "#/search";
    }
    props.onMoreSearch();
  };

  // Handles search icon click
  const onSearchIconClick = () => {
    props.onSearchButton();
    window.location.hash = "#/search";
  };

  // Handles room list item click
  const onHandleroomListClickedACB = () => {
    window.location.hash = "#/roomList";
    props.onHandleroomListClicked();
  };

  // Renders additional search-related elements if search has been performed
  const renderMoreSearch = () => {
    if (props.hasSearched) {
      return (
        <>
          <li>
            <button onClick={handleMoreSearchACB} disabled={!props.searchAvailable}>
              <h5>Visa ytterligare en sida</h5>
            </button>
          </li>
          <li>
            <p>Totalt {props.hasSearched.totalItems} resultat</p>
            <p>{props.moreSearchAmount}</p>
          </li>
        </>
      );
    }
  };

  // Renders logged-in user information or login button
  const renderLoggedInContent = () => {
    if (props.isLoggedIn) {
      return (
        <>
          <li>
            <p>Inloggad som: {props.user.displayName}, {props.user.email}</p>
          </li>
          <li>
            <img src={props.user.photoURL} alt="Användarens profil" />
          </li>
          <li>
            <button onClick={props.onLogInLogOut}>
              <h5>Logga ut</h5>
            </button>
          </li>
        </>
      );
    } else {
      return (
        <li>
          <button onClick={props.onLogInLogOut}>
            <h5>Logga in med Google</h5>
          </button>
        </li>
      );
    }
  };

  // Component Rendering

  return (
    <nav className="nav">
      {/* Search Section */}
      <ul className="nav-section" id="search-nav-section">
        <li>
          <h3>Sök</h3>
        </li>
        <li>
          <input
            type="text"
            value={props.query}
            onChange={handleSearchACB}
            onKeyDown={handleSearchDoingACB}
            placeholder="Sök"
            className="search-input"
          />
        </li>
        <li onClick={onSearchIconClick} className="search-icon search"></li>
        {renderMoreSearch()}
      </ul>

      {/* Links Section */}
      <ul className="nav-section" id="links-nav-section">
        <li>
          <h3>Delsidor</h3>
        </li>
        <li>
          <button onClick={handleResetButtonClick}>
            <h4>Välkomstsida</h4>
          </button>
        </li>
        <li>
          <button onClick={() => window.location.hash = "#/home"}>
            <h4>Home</h4>
          </button>
        </li>
        <li>
          <button onClick={() => window.location.hash = "#/myCalendar"}>
            <h4>My Calendar</h4>
          </button>
        </li>
        <li>
          <button onClick={() => window.location.hash = "#/roomFavoritesList"}>
            <h4>Room Favorites List</h4>
          </button>
        </li>
        {props.doneSearch.done && (
          <li>
            <button onClick={() => window.location.hash = "#/search"}>
              <h4>Söksida</h4>
            </button>
          </li>
        )}
        {props.isLoggedIn && (
          <li>
            <button onClick={onHandleroomListClickedACB}>
              <h4>Favoriter</h4>
            </button>
          </li>
        )}
      </ul>

      {/* Log-in Section */}
      <ul className="nav-section" id="log-in-nav-section">
        <li>
          <h3>Inloggning</h3>
        </li>
        {renderLoggedInContent()}
      </ul>
    </nav>
  );
}
