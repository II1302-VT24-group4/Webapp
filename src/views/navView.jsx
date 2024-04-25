import React from "react";

export default function NavView(props) {
  return (
    <nav class="nav">
      {props.isLoggedIn && (
        <ul class="nav-section" id="search-nav-section">
          <li>
            <h3>Find room</h3>
          </li>
          <input
            type="text"
            value={props.query}
            onChange={(event) => props.onSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                props.onSearchButton();
                window.location.hash = "#/bookableRooms";
              }
            }}
            placeholder="Find Room"
            class="search-input"
          />
        </ul>
      )}
      <ul class="nav-section" id="links-nav-section">
        <li>
          <h3>Pages</h3>
        </li>
        <li>
          <button onClick={props.handleResetButtonClick}>
            <h4>Welcome page</h4>
          </button>
        </li>

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
                  window.location.hash = "#/bookableRooms";
                  props.onSearchButton();
                }}
              >
                <h4>Bookable rooms</h4>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  window.location.hash = "#/roomFavouritesList";
                  props.onRoomListClicked();
                }}
              >
                <h4>Room Favourites List</h4>
              </button>
            </li>{" "}
          </>
        )}
      </ul>
      {/* Log-in Section */}
      <ul class="nav-section" id="log-in-nav-section">
        <li>
          <h3>Log in</h3>
        </li>
        {props.renderLoggedInContent && props.renderLoggedInContent()}
      </ul>
    </nav>
  );
}
