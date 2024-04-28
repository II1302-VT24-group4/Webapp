import React from "react";

export default function NavView(props) {
  return (
    <nav>
      {props.isLoggedIn && (
        <ul>
          <li>
            Find room
          </li>
          <li>
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
            />
          </li>
        </ul>
      )}
      <ul>
        <li>
          Pages
        </li>
        <li>
          <button onClick={props.handleResetButtonClick}>
            Welcome page
          </button>
        </li>
        {props.isLoggedIn && (
          <>
            <li>
              <button onClick={() => (window.location.hash = "#/home")}>
                Home
              </button>
            </li>
            <li>
              <button onClick={() => (window.location.hash = "#/myCalendar")}>
                My Calendar
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  window.location.hash = "#/bookableRooms";
                  props.onSearchButton();
                }}
              >
                Bookable rooms
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  window.location.hash = "#/roomFavouritesList";
                  props.onRoomListClicked();
                }}
              >
                Room Favourites List
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  window.location.hash = "#/meeting";
                }}
              >
                Hold a meeting
              </button>
            </li>
          </>
        )}
      </ul>
      {/* Log-in Section */}
      <ul>
        <li>
          Log in
        </li>
        {props.renderLoggedInContent && props.renderLoggedInContent()}
      </ul>
    </nav>
  );
}
