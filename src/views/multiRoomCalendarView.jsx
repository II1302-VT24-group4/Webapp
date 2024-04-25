import React from "react";
import SingleRoomColumnView from "./singleRoomColumnView.jsx";
import TimeColumnView from "./timeColumnView.jsx";

export default function MutliRoomCalendarView(props) {

    const timeColumn = <div style={{flex: "0 0 auto"}}><TimeColumnView/></div>;
    const calendars = props.rooms.slice(0, 5).map((room, index) => (
        <div key={index} style={{ flex: "0 0 auto", minWidth: "100px" }}>
          <SingleRoomColumnView
            user={props.user}
            addMeeting={props.addMeeting}
            updateMeeting={props.updateMeeting}
            deleteMeeting={props.deleteMeeting}
            getMeetings={props.getMeetings}
            room={room.name}
          />
        </div>
      ));
    
      return (
        <div style={{margin: '10px', display: "flex"}}>
            {timeColumn}
            {calendars}
        </div>
      );
}
