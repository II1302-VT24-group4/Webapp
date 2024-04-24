import React from "react";
import { observer } from "mobx-react-lite";
import HomeView from "../views/HomeView";

export default observer(function HomePresenter(props) {
  return (
    <div>
      <HomeView {...props} />;
    </div>
  );
});
