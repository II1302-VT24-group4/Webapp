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
    const room = event.room;
    //Get ID of new meeting in user
    const newID = Math.random().toString(36).substring(2) + Date.now().toString(36);
    //Go through each attribute and add it to the newly created meeting in the DB
    for(const attribute of Object.keys(event)){
      //The value of the given attribute
      const value = event[attribute];
      //Add to the users collection of meetings
      if(attribute != "owner"){
        props.model.firebaseInsert('users', user, 'meetings', newID, attribute, value, true);
      }
      //Add to the rooms collection of meetings
      if(attribute != "room"){
        props.model.firebaseInsert('rooms', room, 'meetings', newID, attribute, value, true);
      }
    }
    //Add room owner to the meeting in the rooms db collection
    props.model.firebaseInsert('rooms', room, 'meetings', newID, "owner", user, true);
    return newID;
  }

  const updateMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const meetingID = event.id;
    const room = event.room;
    for(const attribute of Object.keys(event)){
      if(attribute != "room" && attribute != "id"){
        const value = event[attribute];
        props.model.firebaseInsert('rooms', room, 'meetings', meetingID, attribute, value, true);
        props.model.firebaseInsert('users', user, 'meetings', meetingID, attribute, value, true);
      }
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
  
  if(rooms){
    timeColumn = <div style={{flex: "0 0 auto"}}><TimeColumnView date={date}/></div>;
    calendars = rooms.slice(0, 15).map((room, index) => (
      <div key={index} style={{ flex: "0 0 auto", minWidth: "100px" }}>
        <SingleRoomColumnView
          user={props.model.userState}
          addMeeting={insertMeetingDB}
          updateMeeting={updateMeetingDB}
          deleteMeeting={deleteMeetingDB}
          getMeetings={getMeetingsDB}
          room={room.name}
          date={date}
        />
      </div>
    ))
  }

  function addToFavouritesACB(room) {
    props.model.modifyFavourites(room, true);
  }

  const setSearchQuery = (value) => {
    props.model.setSearchQuery(value);
  };

  const doSearch = (value) => {
    props.model.doSearch(value);
  };

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
      {!view ? (
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
        />
      ) : (
        <div className="loading-bar-image">
          {/* Placeholder for another view */}
        </div>
      )}
      {view && rooms ? (
        <div style={{margin: '10px', display: "flex"}}>
          {timeColumn}
          {calendars}
          <button onClick={previousDay} style={{backgroundColor: "transparent", marginLeft: "20px", marginRight: "20px"}}>previous day</button>
          <button onClick={nextDay} style={{backgroundColor: "transparent"}}>next day</button>
        </div>
      ) : (
        <div className="loading-bar-image">
          {/* Placeholder for another view */}
        </div>
      )}
    </div>
  );
});
