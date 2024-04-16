export default function NavView(props) {
  return (
    <div>
        <button onClick={routeToHomeACB}>Home</button>
        <button onClick={routeToMyCalendarACB}>My Calendar</button>
        <button onClick={routeToRoomFavoritesListACB}>Room Favorites List</button>
    </div>
  );

  function routeToHomeACB(event){
    event.preventDefault();
    window.location.hash="#/home";
  }
  
  function routeToMyCalendarACB(event){
    event.preventDefault();
    window.location.hash="#/myCalendar";
  }

  function routeToRoomFavoritesListACB(event){
    event.preventDefault();
    window.location.hash="#/roomFavoritesList";
  }
}
