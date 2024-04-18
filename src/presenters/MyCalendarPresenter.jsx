import MyCalendarView from "../views/myCalendarView";
import { observer } from "mobx-react-lite";

export default observer(function MyCalendarPresenter(props) {    

  const insertMeeting = async (event) => {
    const meetings = await props.model.firebaseRead('users', props.model.userState.user, 'meetings');
    const newID = meetings?.length || 0;

    for(const attribute of Object.keys(event)){
      const value = event[attribute];
      props.model.firebaseInsert('users', props.model.userState.user, 'meetings', newID.toString(), attribute, value, true);
    }
  }

  const getDBMeetings = async () => {
    while (props.model.userState.user === null) {
      // Wait for a short period before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return await props.model.firebaseRead('users', props.model.userState.user, 'meetings');
  }

    return (
      <div>
        {<MyCalendarView
          user = {props.model.userState}
          addMeeting = {insertMeeting}
          getMeetings = {getDBMeetings}
        />}
      </div>
    );
  }
);
