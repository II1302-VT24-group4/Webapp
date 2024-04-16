import { TestView } from "../views/TestView.jsx";
import {observer} from "mobx-react-lite";

export default observer( function Test(props){
    return (
        <div>
            {<TestView
                test={props.model}
            />}
        </div>
    );
});