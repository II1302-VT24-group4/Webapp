import React from "react";
//import {reaction} from "mobx";
//import {updateFirebase} from "./firebaseM.js";
import { observable, configure } from "mobx";
import projectModel from "./projectModel.js";
import "/src/styles/style.css";
import model from "/src/projectModel.js"; //TA BORT DENNA NÄR ALLA FUNKTIONER ÄR IMPLEMENTERADE I UserModel
import firebaseModel from "/src/firebaseModel.js";
//import navView from "./views/navView";
//import navViewPresenter from "./presenters/navViewPresenter";
//import router from "./router";                //GÖR ISTÄLLET EN REACT-lösning
//import { RouterView } from "vue-router";      //GÖR ISTÄLLET EN REACT-lösning

configure({ enforceActions: "never" }); // we don't use Mobx actions

export const reactiveModel = observable(projectModel);

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

/*function ProjectApplication(props) {
  return (
    <div class="container">
      <header class="header">
        <h1>
          <span class="part-one-header">Meeting </span>
          <span class="part-two-header">Planner</span>
        </h1>{" "}
        <img
          src="https://cdn-icons-png.flaticon.com/512/115/115902.png"
          alt="Hemsidans logga"
        />
      </header>
      <div class="nav">
        <navViewPresenter model={reactiveModel} />
      </div>
      <div class="main">
        <RouterView></RouterView>
      </div>
      <footer class="footer">
        <h4>
          © Leo Andersson, Seema Fatima Bashir, Christoffer Franzen, Carl-Anton
          Grandelius, Erik Heiskanen, Hein Lee, Andreas Westberg
        </h4>
      </footer>
    </div>
  );
}*/
