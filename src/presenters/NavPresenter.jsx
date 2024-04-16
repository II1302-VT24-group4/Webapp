import NavView from "../views/navView.jsx";
import { observer } from "mobx-react-lite";

export default observer(
  function Nav(props) {
    return (
      <div>
        {<NavView
        />}
      </div>
    );
  }
);