// NavView.jsx
import React from "react";

export default function NavView(props) {
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
            onChange={(event) => props.onSearchQuery(event.target.value)}
            onKeyDown={(event) => props.onSearchButton(event)}
            placeholder="Sök"
            className="search-input"
          />
        </li>
        <li onClick={props.onSearchButton} className="search-icon search"></li>
        {props.renderMoreSearch && props.renderMoreSearch()}
      </ul>

      {/* Links Section */}
      <ul className="nav-section" id="links-nav-section">
        <li>
          <h3>Delsidor</h3>
        </li>
        <li>
          <button onClick={props.handleResetButtonClick}>
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
            <button onClick={props.onHandleroomListClicked}>
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
        {props.renderLoggedInContent && props.renderLoggedInContent()}
      </ul>
    </nav>
  );
}
