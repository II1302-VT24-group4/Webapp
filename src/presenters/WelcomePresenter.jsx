import WelcomeView from "../views/welcomeView.jsx";
import {observer} from "mobx-react-lite";

export default observer( function Welcome(props){
    return (
        <div>
            {<WelcomeView
                
            />}
        </div>
    );
});