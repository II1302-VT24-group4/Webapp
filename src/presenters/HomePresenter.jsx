import React from "react";
import { observer } from "mobx-react-lite";
import HomeView from "../views/HomeView";

export default observer(function HomePresenter(props) {
  return <HomeView {...props} />;
});
