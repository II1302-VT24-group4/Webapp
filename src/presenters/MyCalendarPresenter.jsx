import React, { useState } from 'react';
import MyCalendarView from '../views/myCalendarView';
import { observer } from 'mobx-react-lite';

const MyCalendarPresenter = observer((props) => {

  
  const insertMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const room = event.room;
    const newID = Math.random().toString(36).substring(2) + Date.now().toString(36);

    for (const attribute of Object.keys(event)) {
      const value = event[attribute];
      if (attribute !== 'owner') {
        props.model.firebaseInsert('users', user, 'meetings', newID, attribute, value, true);
      }
      if (attribute !== 'room') {
        props.model.firebaseInsert('rooms', room, 'meetings', newID, attribute, value, true);
      }
    }

    props.model.firebaseInsert('rooms', room, 'meetings', newID, 'owner', user, true);
    return newID;
  };

  const updateMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const meetingID = event.id;
    const room = event.room;

    for (const attribute of Object.keys(event)) {
      if (attribute !== 'room' && attribute !== 'id') {
        const value = event[attribute];
        props.model.firebaseInsert('rooms', room, 'meetings', meetingID, attribute, value, true);
        props.model.firebaseInsert('users', user, 'meetings', meetingID, attribute, value, true);
      }
    }
  };

  const deleteMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const meetingID = event.id;
    const room = event.room;
    
    props.model.firebaseDelete('rooms', room, 'meetings', meetingID);
    props.model.firebaseDelete('users', user, 'meetings', meetingID);
  };

  const getMeetingsDB = async () => {
    const user = props.model.userState.user;
    
    while (user === null) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    
    return await props.model.firebaseRead('users', user, 'meetings');
  };

  return (
    <div>
      <MyCalendarView
        user={props.model.userState}
        addMeeting={insertMeetingDB}
        updateMeeting={updateMeetingDB}
        deleteMeeting={deleteMeetingDB}
        getMeetings={getMeetingsDB}

      />
  </div>
  );
});

export default MyCalendarPresenter;
