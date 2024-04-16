import React from "react";
import Welcome from "./presenters/WelcomePresenter.jsx";
import Nav from "./presenters/NavPresenter.jsx";
import Header from "./presenters/HeaderPresenter.jsx";
import Footer from "./presenters/FooterPresenter.jsx";
import Home from "./presenters/HomePresenter.jsx";
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
    
  // Routes!
  function makeRouter(model) {
    return createHashRouter([
      {
        path: "/",
        element: <Welcome model={model}/>,
      },
      {
        path: "/home",
        element: <Home model={model}/>,
      },
      /*{
        path: "/myCalendar",
        element: <Home model={model}/>,
      },*/
      {
        path: "/roomFavoritesList",
        element: <Home model={model}/>,
      }
    ])
  }
  
});