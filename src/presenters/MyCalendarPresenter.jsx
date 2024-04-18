import MyCalendarView from "../views/myCalendarView";
import { observer } from "mobx-react-lite";

export default observer(function MyCalendarPresenter(props) {    

  const insertMeeting = async (event) => {
    console.log("user", '9rsVJfyNVmU2uneewX8PQCTz5Tw2');
    console.log("insertMeeting", event);
    const meetings = await props.model.firebaseRead('users', /*props.model.userState.user*/ '9rsVJfyNVmU2uneewX8PQCTz5Tw2', 'meetings');
    const newID = meetings?.length || 0;

    for(const attribute of Object.keys(event)){
      const value = event[attribute];
      console.log("Attribute:", attribute, "Value:", value);
      props.model.firebaseInsert('users', /*props.model.userState.user*/ '9rsVJfyNVmU2uneewX8PQCTz5Tw2', 'meetings', newID.toString(), attribute, value, true);
    }
  }

    return (
      <div>
        {<MyCalendarView
          user = {props.model.userState}
          addEvent = {insertMeeting}
        />}
      </div>
    );
  }
);
