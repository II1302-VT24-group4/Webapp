import { observer } from "mobx-react-lite";
import BookableRoomsView from "/src/views/BookableRoomsView";
import React, { useEffect, useState } from "react";
import SingleRoomColumnView from "../views/singleRoomColumnView.jsx";
import TimeColumnView from "../views/timeColumnView.jsx";
import { dbUsers } from "/src/firebaseModel";

const BookableRoomsPresenter = observer((props) => {
  //console.log(dbUsers);
  const [view, setView] = useState(true);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);

  let timeColumn = null;
  let calendars = null;
  const [date, setDate] = useState(0);

  function totalRoomsCount() {
    return Object.values(props.model.officeList).reduce((total, rooms) => {
      const filteredRooms = rooms.filter(
        (room) => !showAvailableRooms || room.available
      );
      return total + filteredRooms.length;
    }, 0);
  }

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
    const participants = event.participants;
    
    props.model.firebaseInsert(
      "rooms",
      room,
      startDate,
      startTime,
      null,
      null,
      "startTime",
      startTime,
      true
    );
    props.model.firebaseInsert(
      "rooms",
      room,
      startDate,
      startTime,
      null,
      null,
      "endDate",
      endDate,
      true
    );
    props.model.firebaseInsert(
      "rooms",
      room,
      startDate,
      startTime,
      null,
      null,
      "endTime",
      endTime,
      true
    );
    props.model.firebaseInsert(
      "rooms",
      room,
      startDate,
      startTime,
      null,
      null,
      "title",
      title,
      true
    );
    props.model.firebaseInsert(
      "rooms",
      room,
      startDate,
      startTime,
      null,
      null,
      "owner",
      user,
      true
    );
    props.model.firebaseInsert(
      "rooms",
      room,
      "meetingIndex",
      startDate,
      null,
      null,
      null,
      null,
      true
    );
    console.log("participants", participants);
    for(const participant of participants){
      props.model.firebaseInsert(
        "rooms",
        room,
        startDate,
        startTime,
        "rfid",
        participant.rfid,
        "owner",
        participant.id,
        true
      );
      props.model.firebaseInsert(
        "users",
        participant.id,
        startDate,
        startTime,
        null,
        null,
        "startTime",
        startTime,
        true
      );
      props.model.firebaseInsert(
        "users",
        participant.id,
        startDate,
        startTime,
        null,
        null,
        "endDate",
        endDate,
        true
      );
      props.model.firebaseInsert(
        "users",
        participant.id,
        startDate,
        startTime,
        null,
        null,
        "endTime",
        endTime,
        true
      );
      props.model.firebaseInsert(
        "users",
        participant.id,
        startDate,
        startTime,
        null,
        null,
        "title",
        title,
        true
      );
      props.model.firebaseInsert(
        "users",
        participant.id,
        startDate,
        startTime,
        null,
        null,
        "room",
        room,
        true
      );
      props.model.firebaseInsert(
        "users",
        participant.id,
        startDate,
        startTime,
        null,
        null,
        "owner",
        user,
        true
      );
      props.model.firebaseInsert(
        "users",
        participant.id,
        "meetingIndex",
        startDate,
        null,
        null,
        null,
        null,
        true
      );
    }
  };

  const updateMeetingDB = async (event) => {
    const oldEvent = {
      startDate: event.oldStartDate,
      startTime: event.oldStartTime,
      room: event.id,
    };
    const { oldStartDate, oldStartTime, ...newEvent } = event;
    await deleteMeetingDB(oldEvent);
    insertMeetingDB(newEvent);
  };

  const deleteMeetingDB = async (event) => {
    const user = props.model.userState.user;
    const room = event.id;
    const startDate = event.startDate;
    const startTime = event.startTime;

    await props.model.firebaseDelete("users", user, startDate, startTime);
    await props.model.firebaseDelete("rooms", room, startDate, startTime);

    const roomMeetingDates = await props.model.firebaseRead(
      "rooms",
      room,
      startDate
    );
    if (roomMeetingDates.length === 0) {
      props.model.firebaseDelete("rooms", room, "meetingIndex", startDate);
    }
  };

  const getMeetingsDB = async (room) => {
    while (props.model.userState.user === null) {
      // Wait for a short period before checking again
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const result = await props.model.firebaseRead(
      "rooms",
      room,
      "meetingIndex"
    );
    let meetings = [];
    if (result !== undefined) {
      for (const date of result) {
        const meetingDataArray = await props.model.firebaseRead(
          "rooms",
          room,
          date.id
        );
        for (const meetingData of meetingDataArray) {
          const downloads = await props.model.firebaseGetFiles(
            room,
            date.id,
            meetingData.id
          );
          const meetingUpdated = {
            startDate: date.id,
            startTime: meetingData.id,
            endDate: meetingData.endDate,
            endTime: meetingData.endTime,
            title: meetingData.title,
            owner: meetingData.owner,
            downloads: downloads,
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
    console.log(room);
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

  timeColumn = (
    <div style={{ flex: "0 0 auto", marginRight: "20px", marginTop: "20px" }}>
      <TimeColumnView date={date} />
    </div>
  );
  if (!props.model.searchDone.done) {
    return (
      <div className="loading-bar-image">
        <img src="https://i.ibb.co/BCtKCSK/loading-bar.gif" alt="Loading" />
      </div>
    );
  } else {
    calendars = Object.entries(props.model.officeList).map(
      ([officeName, rooms]) => (
        <div key={officeName}>
          <h2 style={{ fontSize: "30px" }}>{officeName}</h2>
          <div
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              marginLeft: "10px",
            }}
          >
            {rooms.map((room, index) =>
              showAvailableRooms && !room.available ? null : ( // Check both room availability and checkbox state
                <div
                  key={`${officeName}-${index}`}
                  style={{ display: "inline-block", minWidth: "100px" }}
                >
                  <SingleRoomColumnView
                    user={props.model.userState}
                    addMeeting={insertMeetingDB}
                    updateMeeting={updateMeetingDB}
                    deleteMeeting={deleteMeetingDB}
                    getMeetings={getMeetingsDB}
                    id={room.id}
                    name={room.name}
                    date={date}
                    seats={room.seats}
                    available={room.available}
                    users={dbUsers}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )
    );
  }

  return (
    <div>
      <style>
        {`
        .sub-menu {
          display: flex;
          justify-content: center;
          
          background-color: #81a59c;
          padding: 10px 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          width: 98.55vw;
        }
        .sub-menu button{
          margin-top: .1vw;
          margin-left: .5vw !important;
          margin-right: .5vw !important;

        }
        .sub-menu button:disabled {
          color: #ccc;
        }
        .sub-menu .search-input {
          padding: 8px;
          border: 2px solid #6e6e6e;
          border-radius: 5px;
          width: 200px;
        }
        `}
      </style>
      <div className="sub-menu">
        <div className="room-grid">
          <button
            onClick={() => setView(true)}
            disabled={view}
            className="grid-view-rubric"
          >
            <h5>Grid view booking by day</h5>
          </button>
          {view && (
            <>
              <button onClick={previousDay} className="grid-view-back">
                <h5>Previous Day</h5>
              </button>
              <button onClick={nextDay} className="grid-view-forward">
                <h5>Next Day</h5>
              </button>
            </>
          )}
        </div>

        <button onClick={() => setView(false)} disabled={!view}>
          <h5>Book by specific room</h5>
        </button>
        <div>
          <input
            type="text"
            value={props.query}
            onChange={(event) => props.model.setSearchQuery(event.target.value)}
            onKeyDown={() => props.model.doSearch(props.query)}
            placeholder="Search room or office"
            className="search-input"
          />
        </div>
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
          users={dbUsers}
          showAvailableRooms={showAvailableRooms}
        />
      )}
      {view && (
        <div>
          <h2>Grid view booking by day</h2>
          <h3>
            Search for "{props.model.currentQuery}". Showing {totalRoomsCount()}{" "}
            rooms
          </h3>
          <div className="filter-checkbox">
            <label>
              <input
                type="checkbox"
                checked={showAvailableRooms}
                onChange={(e) => {
                  setShowAvailableRooms(e.target.checked);
                  setShowAvailableRooms(!showAvailableRooms);
                }}
              />
            </label>
            <h3>Only show currently available rooms</h3>
          </div>
          <div className="calendar-container">
            <div className="time-column">{timeColumn}</div>
            <div className="calendar-scroll">{calendars}</div>
          </div>
        </div>
      )}
    </div>
  );
});

export default BookableRoomsPresenter;
