import React from "react";
import Welcome from "./presenters/WelcomePresenter.jsx";
import Nav from "./presenters/NavPresenter.jsx";
import BookableRoomsView from "./presenters/BookableRoomsPresenter";
import RoomFavouriteListView from "./presenters/RoomFavouriteListPresenter";
import MeetingView from "./presenters/MeetingPresenter";
import MyCalendar from "./presenters/MyCalendarPresenter";
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
    { path: "/bookableRooms", element: <BookableRoomsView model={model} /> },
    { path: "/meeting", element: <MeetingView model={model} /> },
    { path: "/myCalendar", element: <MyCalendar model={model} /> },
    {
      path: "/roomFavouritesList",
      element: <RoomFavouriteListView model={model} />,
    },
  ]);
}
