import MyCalendarView from "../views/MyCalendarView";
import { observer } from "mobx-react-lite";

export default observer(function MyCalendarPresenter(props) {
    
    return (
      <div>
        {<MyCalendarView
         
        />}
      </div>
    );
  }
);
