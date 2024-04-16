import WelcomeView from "../views/WelcomeView.jsx";
import { observer } from "mobx-react-lite";

export default observer(function Welcome(props) {
  return <WelcomeView />;
});
