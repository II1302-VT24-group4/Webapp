import { createRouter, createWebHashHistory } from "vue-router"; //Ska vara i REACT!
import FavouritesPresenter from "/src/presenters/favouritesPresenter.jsx";
import HomePresenter from "/src/presenters/HomePresenter";
import mainWelcomeView from "/src/views/mainWelcomeView.jsx";

export default function makeRouter(model) {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: "/",
        component: <mainWelcomeView></mainWelcomeView>,
      },
      {
        path: "/search",
        component: <HomePresenter model={model}></HomePresenter>,
      },
      {
        path: "/favourites",
        component: <FavouritesPresenter model={model}></FavouritesPresenter>,
      },
    ],
  });
}
