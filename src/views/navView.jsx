import React from "react";

export default function NavView(props) {
  return (
    <nav className="nav">
      {props.isLoggedIn && (
        <ul className="nav-section" id="search-nav-section">
          <li>
            <h3>Find room</h3>
          </li>
          <input
            type="text"
            value={props.query}
            onChange={(event) => props.onSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                window.location.hash = "#/bookableRooms";
                props.onSearchButton();
              }
            }}
            placeholder="Find Room"
            className="search-input"
          />
        </ul>
      )}
      <ul className="nav-section" id="links-nav-section">
        <li>
          <h3>Pages</h3>
        </li>
        <li>
          <button onClick={props.handleResetButtonClick}>
            <h4>Welcome page</h4>
          </button>
        </li>

        {props.doneSearch.done && (
          <li>
            <button
              onClick={() => {
                window.location.hash = "#/bookableRooms";
              }}
            >
              <h4>Bookable rooms</h4>
            </button>
          </li>
        )}
        {props.isLoggedIn && (
          <>
            <li>
              <button onClick={() => (window.location.hash = "#/home")}>
                <h4>Home</h4>
              </button>
            </li>
            <li>
              <button onClick={() => (window.location.hash = "#/myCalendar")}>
                <h4>My Calendar</h4>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  window.location.hash = "#/roomFavoritesList";
                  props.onHandleroomListClicked();
                }}
              >
                <h4>Room Favorites List</h4>
              </button>
            </li>{" "}
          </>
        )}
      </ul>
      {/* Log-in Section */}
      <ul className="nav-section" id="log-in-nav-section">
        <li>
          <h3>Log in</h3>
        </li>
        {props.renderLoggedInContent && props.renderLoggedInContent()}
      </ul>
    </nav>
  );
}
