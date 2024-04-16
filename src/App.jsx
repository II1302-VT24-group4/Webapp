import React from 'react';
//import './App.css';
import Test from './presenters/TestPresenter.jsx';
import {  createHashRouter,  RouterProvider } from "react-router-dom";
import { observer } from "mobx-react-lite";

export default observer(function App(props) {


  return (
    <div>
        <div><RouterProvider router={makeRouter(props.model)}/> </div>
      </div>
  );
    
  // Routes!
  function makeRouter(model) {
    return createHashRouter([
      {
        path: "/",
        element: <Test model={model}/>,
      },
      {
        path: "/test",
        //element: <Test model={model}/>,
      },
    ])
  }
  
});