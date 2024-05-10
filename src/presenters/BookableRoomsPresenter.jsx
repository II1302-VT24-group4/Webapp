import { observer } from "mobx-react-lite";
import BookableRoomsView from "/src/views/BookableRoomsView";
import React, { useEffect, useState } from 'react';
import SingleRoomColumnView from "../views/singleRoomColumnView.jsx";
import TimeColumnView from "../views/timeColumnView.jsx";

export default observer(function BookableRoomsPresenter(props) {
  const [view, setView] = useState(true);

  let timeColumn = null;
  let calendars = null;
  const [date, setDate] = useState(0);

  const previousDay = () => {
    setDate(date - 1);
  };
  const nextDay = () => {
    setDate(date + 1);
  };

  const insertMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const room = event.id;
    const startDate = event.startDate;
    const startTime = event.startTime;
    const endDate = event.endDate;
    const endTime = event.endTime;
    const title = event.title;

    props.model.firebaseInsert('rooms', room, startDate, startTime, "startTime", startTime, true);
    props.model.firebaseInsert('rooms', room, startDate, startTime, "endDate", endDate, true);
    props.model.firebaseInsert('rooms', room, startDate, startTime, "endTime", endTime, true);
    props.model.firebaseInsert('rooms', room, startDate, startTime, "title", title, true);
    props.model.firebaseInsert('rooms', room, startDate, startTime, "owner", user, true);
    props.model.firebaseInsert('rooms', room, 'meetingIndex', startDate, null, null, true);

    props.model.firebaseInsert('users', user, startDate, startTime, "startTime", startTime, true);
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
      room: event.id
    };
    const {oldStartDate, oldStartTime, ...newEvent } = event;
    await deleteMeetingDB(oldEvent);
    insertMeetingDB(newEvent);
  };

  const deleteMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const room = event.id;
    const startDate = event.startDate;
    const startTime = event.startTime;

    await props.model.firebaseDelete('users', user, startDate, startTime);
    await props.model.firebaseDelete('rooms', room, startDate, startTime);

    const roomMeetingDates = await props.model.firebaseRead('rooms', room, startDate);
    if(roomMeetingDates.length === 0){
      props.model.firebaseDelete('rooms', room, 'meetingIndex', startDate);
    }
  };

  const getMeetingsDB = async (room) => {
    while (props.model.userState.user === null) {
      // Wait for a short period before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const result = await props.model.firebaseRead("rooms", room, 'meetingIndex');
    let meetings = [];
    if(result !== undefined){
      for(const date of result){
        const meetingDataArray = await props.model.firebaseRead('rooms', room, date.id);
        for (const meetingData of meetingDataArray) {
          const meetingUpdated = {
              startDate: date.id,
              startTime: meetingData.id,
              endDate: meetingData.endDate,
              endTime: meetingData.endTime,
              title: meetingData.title,
              owner: meetingData.owner
          };
          meetings.push(meetingUpdated);
        }
      }
      meetings = meetings.flat();
    }
    return meetings;
  };

  function addToFavouritesACB(room) {
    props.model.modifyFavourites(room, true);
  }

  const setSearchQuery = (value) => {
    props.model.setSearchQuery(value);
  };

  const doSearch = (value) => {
    props.model.doSearch(value);
  };

  useEffect(() => {
    if (props.model.searchResultsPromiseState.data) {
      props.model.getRooms();
    }
  }, [props.model.searchResultsPromiseState.data]);

  if (!props.model.searchDone.done) {
    return (
      <div className="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif" alt="Loading" />
      </div>
    );
  }
  

  timeColumn = <div style={{flex: "0 0 auto", marginRight: "20px"}}><TimeColumnView date={date}/></div>;

  if (props.model.searchDone.done) {
    calendars = Object.entries(props.model.officeList).map(([officeName, rooms]) => (
      <div key={officeName}>
        <h2 style={{ fontSize: "30px"}}>{officeName}</h2> {/* Office name */}
        <div style={{ overflowX: "auto", whiteSpace: "nowrap", marginLeft: "10px" }}>
          {rooms.map((room, index) => (
            <div key={`${officeName}-${index}`} style={{ display: "inline-block", minWidth: "100px"}}>
              <SingleRoomColumnView
                user={props.model.userState}
                addMeeting={insertMeetingDB}
                updateMeeting={updateMeetingDB}
                deleteMeeting={deleteMeetingDB}
                getMeetings={getMeetingsDB}
                id={room.id}
                name={room.name}
                date={date}
              />
            </div>
          ))}
        </div>
      </div>
    ));
  }
  
  
  
  
  
  return (
    <div>
      <button onClick={() => setView(true)} style={{backgroundColor: "transparent", marginLeft: "20px", marginRight: "20px"}} disabled={view}>timeedit</button>
      <button onClick={() => setView(false)} style={{backgroundColor: "transparent"}} disabled={!view}>detailed</button>
      <div>
        <input
          type="text"
          value={props.query}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={() => doSearch()}
          placeholder="Find Room"
          className="search-input"
        />
      </div>
      {!view && (
        <BookableRoomsView
          onSearchQuery={setSearchQuery}
          onSearchButton={doSearch}
          onModifyRoomList={addToFavouritesACB}
          images={props.model.imageHolder}
          rooms={props.model.officeList}
          query={props.model.currentQuery}
          alertMessage={props.model.isAlertMessage}
          showAlert={props.model.isShowAlert}
          loggedIn={props.model.userState.isLoggedIn}
          office={props.model.office}
          addMeeting={insertMeetingDB}
          user={props.model.userState}
          updateMeeting={updateMeetingDB}
          deleteMeeting={deleteMeetingDB}
          getMeetings={getMeetingsDB}
        />
      )}
      {view && (
        <div>
          <button onClick={previousDay} style={{backgroundColor: "transparent", marginLeft: "20px", marginRight: "20px"}}>previous day</button>
          <button onClick={nextDay} style={{backgroundColor: "transparent"}}>next day</button>
          <div style={{margin: '10px', display: "flex"}}>
            <div style={{flex: "0 0 auto"}}>
              {timeColumn}
            </div>
            <div style={{maxWidth: "90vw", overflowX: "auto", display: "flex"}}> {/* Apply display: flex; */}
              {calendars}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
