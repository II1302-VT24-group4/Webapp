import React from "react";
import Welcome from "./presenters/WelcomePresenter.jsx";
import Nav from "./presenters/NavPresenter.jsx";
import Home from "./presenters/HomePresenter.jsx";
import BookableRoomsView from "./presenters/BookableRoomsPresenter";
import RoomFavouriteListView from "./presenters/RoomFavouriteListPresenter";
import MeetingView from "./presenters/MeetingPresenter";
import MultiRoomCalendar from "./presenters/MultiRoomCalendarPresenter.jsx";
import Header from "./views/HeaderView.jsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { observer } from "mobx-react-lite";

export default observer(function App(props) {
  return (
    <div className="container">
      <Header model={props.model} />
      <RouterProvider router={makeRouter(props.model)} />
      <Nav model={props.model} />
    </div>
  );
});

function makeRouter(model) {
  return createHashRouter([
    { path: "/", element: <Welcome model={model} /> },
    { path: "/home", element: <Home model={model} /> },
    { path: "/bookableRooms", element: <BookableRoomsView model={model} /> },
    { path: "/meeting", element: <MeetingView model={model} /> },
    { path: "/myCalendar", element: <MultiRoomCalendar model={model} /> },
    {
      path: "/roomFavouritesList",
      element: <RoomFavouriteListView model={model} />,
    },
  ]);
}
