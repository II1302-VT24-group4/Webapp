import React from "react";
import { observer } from "mobx-react-lite";

export default observer(function HomePresenter(props) {
  return (
    <div>
      <HomeView {...props} />;
    </div>
  );
});
