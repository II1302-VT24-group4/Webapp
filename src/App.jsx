import React from "react";
import Welcome from "./presenters/WelcomePresenter.jsx";
import Nav from "./presenters/NavPresenter.jsx";
import Header from "./presenters/HeaderPresenter.jsx";
import Footer from "./presenters/FooterPresenter.jsx";
import Home from "./presenters/HomePresenter.jsx";
import BookableRoomsView from "./presenters/BookableRoomsPresenter";
import MyCalendar from "./presenters/MyCalendarPresenter.jsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { observer } from "mobx-react-lite";

export default observer(function App(props) {
  return (
    <div class="container">
      <Header model={props.model} />
      <RouterProvider router={makeRouter(props.model)} />
      <Nav model={props.model} />
      <Footer model={props.model} />
    </div>
  );
});

function makeRouter(model) {
  return createHashRouter([
    { path: "/", element: <Welcome model={model} /> },
    { path: "/home", element: <Home model={model} /> },
    { path: "/bookableRooms", element: <BookableRoomsView model={model} /> },
    {
      path: "/myCalendar",
      element: <MyCalendar model={model} />,
    },
    { path: "/roomFavoritesList", element: <Home model={model} /> },
  ]);
}
