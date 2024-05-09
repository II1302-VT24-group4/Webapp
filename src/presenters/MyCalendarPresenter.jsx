import React, { useState } from 'react';
import MyCalendarView from '../views/myCalendarView';
import { observer } from 'mobx-react-lite';

const MyCalendarPresenter = observer((props) => {

  const insertMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const room = event.room;
    const startDate = event.startDate;
    const startTime = event.startTime;
    const endDate = event.endDate;
    const endTime = event.endTime;
    const title = event.title;

    props.model.firebaseInsert('rooms', room, startDate, startTime, "endDate", endDate, true);
    props.model.firebaseInsert('rooms', room, startDate, startTime, "endTime", endTime, true);
    props.model.firebaseInsert('rooms', room, startDate, startTime, "title", title, true);
    props.model.firebaseInsert('rooms', room, startDate, startTime, "owner", user, true);
    props.model.firebaseInsert('rooms', room, 'meetingIndex', startDate, null, null, true);

    props.model.firebaseInsert('users', user, startDate, startTime, "endDate", endDate, true);
    props.model.firebaseInsert('users', user, startDate, startTime, "endTime", endTime, true);
    props.model.firebaseInsert('users', user, startDate, startTime, "title", title, true);
    props.model.firebaseInsert('users', user, startDate, startTime, "room", room, true);
    props.model.firebaseInsert('users', user, startDate, startTime, "owner", user, true);
    props.model.firebaseInsert('users', user, 'meetingIndex', startDate, null, null, true);
  };

  const updateMeetingDB = async (event) => {

    const oldEvent = {
      startDate: event.oldStartDate,
      startTime: event.oldStartTime,
      room: event.room
    };
    const {oldStartDate, oldStartTime, ...newEvent } = event;
    await deleteMeetingDB(oldEvent);
    insertMeetingDB(newEvent);
  }

  const deleteMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const room = event.room;
    const startDate = event.startDate;
    const startTime = event.startTime;

    await props.model.firebaseDelete('users', user, startDate, startTime);
    await props.model.firebaseDelete('rooms', room, startDate, startTime);

    const roomMeetingDates = await props.model.firebaseRead('rooms', room, startDate);
    if(roomMeetingDates.length === 0){
      props.model.firebaseDelete('rooms', room, 'meetingIndex', startDate);
    }
  }

  const getMeetingsDB = async () => {
    const user = props.model.userState.user;
    while (user === null) {
      // Wait for a short period before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const result = await props.model.firebaseRead("users", user, 'meetingIndex');
    let meetings = [];
    if(result !== undefined){
      for(const date of result){
        const meetingDataArray = await props.model.firebaseRead('users', user, date.id);
        for (const meetingData of meetingDataArray) {
          const downloads = await props.model.firebaseGetFiles(meetingData.room, date.id, meetingData.id);
          const meetingUpdated = {
              startDate: date.id,
              startTime: meetingData.id,
              endDate: meetingData.endDate,
              endTime: meetingData.endTime,
              title: meetingData.title,
              owner: meetingData.owner,
              room: meetingData.room,
              downloads: downloads
          };
          meetings.push(meetingUpdated);
        }
      }
      meetings = meetings.flat();
    }
    return meetings;
  }

  return (
    <div>
      <MyCalendarView
        user={props.model.userState}
        updateMeeting={updateMeetingDB}
        deleteMeeting={deleteMeetingDB}
        getMeetings={getMeetingsDB}
      />
  </div>
  );
});

export default MyCalendarPresenter;
