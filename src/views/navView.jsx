import React from "react";

export default function NavView(props) {
  return (
    <nav className="nav">
      <div className="nav-section links-nav-section">
        <button onClick={props.handleResetButtonClick}>
          <h4>Welcome Page</h4>
        </button>
        {props.isLoggedIn && (
          <>
            <button onClick={() => (window.location.hash = "#/myCalendar")}>
              <h4>My Calendar</h4>
            </button>
            <button
              onClick={() => {
                window.location.hash = "#/bookableRooms";
                props.onSearchButton();
              }}
            >
              <h4>Bookable Rooms</h4>
            </button>
            {/*<button
              onClick={() => {
                window.location.hash = "#/roomFavouritesList";
                props.onRoomListClicked();
              }}
            >
              <h4>Room Favourites List</h4>
            </button>*/}
            <button onClick={() => (window.location.hash = "#/meeting")}>
              <h4>Hold a Meeting</h4>
            </button>
          </>
        )}
      </div>
      <div className="nav-section log-in-nav-section">
        {props.renderLoggedInContent && props.renderLoggedInContent()}
      </div>
    </nav>
  );
}
