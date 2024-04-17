import MyCalendarView from "../views/MyCalendarView";
import { observer } from "mobx-react-lite";

export default observer(function MyCalendarPresenter(props) {
  console.log(props.model)
    
    return (
      <div>
        {<MyCalendarView
          user = {props.model.userState}
         
        />}
      </div>
    );
  }
);
