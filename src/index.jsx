import React from 'react'
//import {reaction} from "mobx";
//import {updateFirebase} from "./firebaseM.js";
import { observable, configure } from "mobx";
import UserModel from "./UserModel.js";

configure({ enforceActions: "never", });  // we don't use Mobx actions

export const reactiveModel= observable(UserModel);

import {createElement} from "react";
window.React= {createElement:createElement};

import {createRoot} from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById('root'))
    .render(<App model={reactiveModel}/>);

window.myModel = reactiveModel;

//updateFirebase(reactiveModel,reaction);