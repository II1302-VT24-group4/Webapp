/*Current issue, the meetingID differs in the personal meeting compared to the room meeting,
 so deleting/updating it is a bit of an issue as we currently only send the room meeting id.
 Right now we get the meetings from each room(since we display each room) but it doesn't care
 about the user
*/

import MultiRoomCalendar from "../views/multiRoomCalendarView.jsx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from 'react';

export default observer(function MultiRoomCalendarPresenter(props) {    

  const insertMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const room = event.room;
    //Get ID of new meeting in user
    const newID = Math.random().toString(36).substring(2) + Date.now().toString(36);
    //Go through each attribute and add it to the newly created meeting in the DB
    for(const attribute of Object.keys(event)){
      //The value of the given attribute
      const value = event[attribute];
      //Add to the users collection of meetings
      props.model.firebaseInsert('users', user, 'meetings', newID, attribute, value, true);
      //Add to the rooms collection of meetings
      if(attribute != "room"){
        props.model.firebaseInsert('rooms', room, 'meetings', newID, attribute, value, true);
      }
    }
    //Add room owner to the meeting in the rooms db collection
    props.model.firebaseInsert('rooms', room, 'meetings', newID, "owner", user, true);
  }

  const updateMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const meetingID = event.id;
    const room = event.room;
    for(const attribute of Object.keys(event)){
      const value = event[attribute];
      props.model.firebaseInsert('rooms', room, 'meetings', meetingID, attribute, value, true);
      props.model.firebaseInsert('users', user, 'meetings', meetingID, attribute, value, true);
    }
  }

  const deleteMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const meetingID = event.id;
    const room = event.room;
    props.model.firebaseDelete('rooms', room, 'meetings', meetingID);
    props.model.firebaseDelete('users', user, 'meetings', meetingID);
  }

  const getMeetingsDB = async (room) => {
    while (props.model.userState.user === null) {
      // Wait for a short period before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return await props.model.firebaseRead('rooms', room, 'meetings');
  }

  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsData = await props.model.firebaseRead('rooms');
      setRooms(roomsData);
    };

    fetchRooms();
  }, [props.model]);

  if(!rooms){
    return <div>Loading...</div>;
  }
  else{
    return (
      <div>
        {<MultiRoomCalendar
          user = {props.model.userState}
          addMeeting = {insertMeetingDB}
          updateMeeting = {updateMeetingDB}
          deleteMeeting = {deleteMeetingDB}
          getMeetings = {getMeetingsDB}
          rooms={rooms}
        />}
      </div>
    );
  }
});
