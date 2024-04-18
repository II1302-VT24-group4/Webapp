import React from "react";
//import {reaction} from "mobx";
//import {updateFirebase} from "./firebaseM.js";
import { observable, configure } from "mobx";
import userModel from "./UserModel.js";
import "/src/styles/style.css";
//import firebaseModel from "/src/firebaseModel.js";

configure({ enforceActions: "never" }); // we don't use Mobx actions

export const reactiveModel = observable(userModel);

import { createElement } from "react";
window.React = { createElement: createElement };

import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <App model={reactiveModel} />
);

/*const app = createApp(
  <ProjectApplication model={reactiveModel}></ProjectApplication>
);*/
//app.use(router(reactiveModel));
//app.mount("#root");

//firebaseModel(reactiveModel, watch);

window.myModel = reactiveModel;

//updateFirebase(reactiveModel,reaction);

//How inserts work
//userModel.firebaseInsert('users', '123', 'RFID', 123, true);

//How read works
//userModel.firebaseRead('users');