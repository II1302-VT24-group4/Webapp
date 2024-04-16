import FooterView from "../views/footerView.jsx";
import {observer} from "mobx-react-lite";

export default observer( function Footer(props){
    return (
        <div>
            {<FooterView
                
            />}
        </div>
    );
});