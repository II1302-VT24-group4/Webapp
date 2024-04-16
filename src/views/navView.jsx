export default function NavView(props) {
  function IconActive() {
    props.SearchIconActive.active = true;

    setTimeout(() => {
      props.SearchIconActive.active = false;
    }, 100);
  }

  function routeToHomeACB(event) {
    event.preventDefault();
    window.location.hash = "#/home";
  }

  function routeToMyCalendarACB(event) {
    event.preventDefault();
    window.location.hash = "#/myCalendar";
  }

  function routeToRoomFavoritesListACB(event) {
    event.preventDefault();
    window.location.hash = "#/roomFavoritesList";
  }

  function handleSearchACB(event) {
    props.onSearchQuery(event.target.value);
  }

  function handleSearchDoingACB(event) {
    if (event.key === "Enter") {
      props.onSearchButton();
      window.location.hash = "#/search";
    }
  }

  function handleResetButtonClick() {
    window.location.hash = "#/";
  }

  function handleLogInOutACB(event) {
    props.onLogInLogOut();
  }

  function handleMoreSearchACB(event) {
    if (window.location.hash !== "#/search") {
      window.location.hash = "#/search";
    }
    props.onMoreSearch();
  }

  function onSearchIconClick() {
    props.onSearchButton();
    window.location.hash = "#/search";
  }

  function onHandleroomListClickedACB() {
    window.location.hash = "#/roomList";
    props.onHandleroomListClicked();
  }

  function onHandleSearchClickedACB() {
    //window.location.hash = "#/search";
  }

  return (
    <nav className="nav">
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
        {props.hasSearched && (
          <>
            <li>
              <button
                onClick={handleMoreSearchACB}
                disabled={!props.searchAvailable}
              >
                <h5>Visa ytterligare en sida</h5>
              </button>
            </li>
            <li>
              <p>Totalt {props.hasSearched.totalItems} resultat</p>
              <p>{props.moreSearchAmount}</p>
            </li>
          </>
        )}
      </ul>

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
          <button onClick={routeToHomeACB}>
            <h4>Home</h4>
          </button>
        </li>
        <li>
          <button onClick={routeToMyCalendarACB}>
            <h4>My Calendar</h4>
          </button>
        </li>
        <li>
          <button onClick={routeToRoomFavoritesListACB}>
            <h4>Room Favorites List</h4>
          </button>
        </li>
        {props.doneSearch.done && (
          <li>
            <button onClick={onHandleSearchClickedACB}>
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

      <ul className="nav-section" id="log-in-nav-section">
        <li>
          <h3>Inloggning</h3>
        </li>
        {props.isLoggedIn ? (
          <>
            <li>
              <p>
                Inloggad som: {props.user.displayName}, {props.user.email}
              </p>
            </li>
            <li>
              <img src={props.user.photoURL} alt="Användarens profil" />
            </li>
            <li>
              <button onClick={handleLogInOutACB}>
                <h5>Logga ut</h5>
              </button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogInOutACB}>
              <h5>Logga in med Google</h5>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
