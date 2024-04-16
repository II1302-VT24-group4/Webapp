import HeaderView from "../views/headerView.jsx";
import { observer } from "mobx-react-lite";

export default observer(function Header(props) {
  return <HeaderView />;
});
