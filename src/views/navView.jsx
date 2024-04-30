import React from "react";

export default function NavView(props) {
  return (
    <nav className="nav">
      <div className="nav-section links-nav-section">
        <button onClick={props.handleResetButtonClick}>
          <h4>Welcome page</h4>
        </button>
        {props.isLoggedIn && (
          <>
            <button onClick={() => (window.location.hash = "#/home")}>
              <h4>Home</h4>
            </button>
            <button onClick={() => (window.location.hash = "#/myCalendar")}>
              <h4>My Calendar</h4>
            </button>
            <button
              onClick={() => {
                window.location.hash = "#/bookableRooms";
                props.onSearchButton();
              }}
            >
              <h4>Bookable rooms</h4>
            </button>
            <button
              onClick={() => {
                window.location.hash = "#/roomFavouritesList";
                props.onRoomListClicked();
              }}
            >
              <h4>Room Favourites List</h4>
            </button>
            <button onClick={() => (window.location.hash = "#/meeting")}>
              <h4>Hold a meeting</h4>
            </button>
          </>
        )}
      </div>
      <div className="nav-section log-in-nav-section">
        <h3>Log in</h3>
        {props.renderLoggedInContent && props.renderLoggedInContent()}
      </div>
    </nav>
  );
}
