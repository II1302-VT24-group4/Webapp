import React from 'react';
//import './App.css';
import Welcome from './presenters/WelcomePresenter.jsx';
import Nav from './presenters/NavPresenter.jsx';
import Header from './presenters/HeaderPresenter.jsx';
import Footer from './presenters/FooterPresenter.jsx';
import Home from './presenters/HomePresenter.jsx';
import MyCalendar from './presenters/MyCalendarPresenter.jsx';
import RoomFavoritesList from './presenters/FavoritesPresenter.jsx';
import {  createHashRouter,  RouterProvider } from "react-router-dom";
import { observer } from "mobx-react-lite";

export default observer(function App(props) {


  return (
    <div>
        <div><Header model={props.model}/></div>
        <div><Nav model={props.model}/></div>
        <div><RouterProvider router={makeRouter(props.model)}/> </div>
        <div><Footer model={props.model}/></div>
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
      {
        path: "/myCalendar",
        element: <MyCalendar model={model}/>,
      },
      {
        path: "/roomFavoritesList",
        element: <Home model={model}/>,
      }
    ])
  }
  
});