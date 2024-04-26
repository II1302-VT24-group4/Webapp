import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function MeetingView(props) {
  const [participants, setParticipants] = useState([]);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [speakerTimes, setSpeakerTimes] = useState({});
  const [totalTimeSpoken, setTotalTimeSpoken] = useState({});

  useEffect(() => {
    let intervalId = null;
    if (participants.length > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          const currentSpeakerTime =
            speakerTimes[participants[currentSpeakerIndex]] || 60;
          if (prevTimer < currentSpeakerTime - 1) {
            return prevTimer + 1;
          } else {
            const nextSpeakerIndex =
              (currentSpeakerIndex + 1) % participants.length;
            setCurrentSpeakerIndex(nextSpeakerIndex);
            setTotalTimeSpoken((prev) => ({
              ...prev,
              [participants[currentSpeakerIndex]]:
                (prev[participants[currentSpeakerIndex]] || 0) +
                currentSpeakerTime,
            }));
            return 0; //återställ timer
          }
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [currentSpeakerIndex, participants, speakerTimes]);

  const handleAddParticipant = (event) => {
    event.preventDefault();
    const name = event.target.participantName.value.trim();
    if (name && !participants.includes(name)) {
      setParticipants([...participants, name]);
      setSpeakerTimes({ ...speakerTimes, [name]: 60 });
      setTotalTimeSpoken({ ...totalTimeSpoken, [name]: 0 });
      event.target.reset();
    }
  };

  const onDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;
    const items = Array.from(participants);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setParticipants(items);
  };

  return (
    <main className="meetingFacilitator main-welcome">
      {props.showAlert?.alert && (
        <div className="alert-box">
          <h2>{props.alertMessage.message}</h2>
        </div>
      )}
      <h2>Hold a meeting</h2>
      <div className="welcome-view">
        <h3>Welcome!</h3>
        <p>Start here to hold a meeting.</p>
        <p>This page can be used independently from any meeting rooms.</p>
        <p>When connected to a room, more features are unlocked.</p>
        <p>Access all meeting functions.</p>
        <p>Access meeting documents and information.</p>
        <p>
          Note: The meeting leader should have the app open on their device
          during the meeting for the group to use the meeting facilitator
          features.
        </p>
        <form onSubmit={handleAddParticipant}>
          <input
            name="participantName"
            type="text"
            placeholder="Enter participant's name"
            required
          />
          <button type="submit">Add Participant</button>
        </form>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="participants">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {participants.map((participant, index) => (
                  <Draggable
                    key={participant}
                    draggableId={participant}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {participant}
                        <span>
                          {" "}
                          Total Time Spoken: {totalTimeSpoken[participant] || 0}
                          s{" "}
                        </span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </main>
  );
}
