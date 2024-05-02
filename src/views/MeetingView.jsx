import React, { useState, useEffect } from "react";

export default function MeetingView(props) {
  const [participants, setParticipants] = useState([]);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [previousSpeakerIndex, setPreviousSpeakerIndex] = useState(null);
  const [timer, setTimer] = useState(0);
  const [speakerTimes, setSpeakerTimes] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [individualTimes, setIndividualTimes] = useState({});
  const [speakingRounds, setSpeakingRounds] = useState({});
  const [tempSpeakerTimes, setTempSpeakerTimes] = useState({});
  const [showTimeTracker, setShowTimeTracker] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [clearTimeOnSwitch, setClearTimeOnSwitch] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [displayCurrentSpeaker, setDisplayCurrentSpeaker] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false); //

  useEffect(() => {
    let intervalId = null;
    if (
      timerActive &&
      participants.length >= 2 &&
      displayCurrentSpeaker &&
      !timerPaused
    ) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          const currentSpeaker = participants[currentSpeakerIndex];
          const currentSpeakerTime = speakerTimes[currentSpeaker] || 15;
          if (prevTimer < currentSpeakerTime) {
            setTotalTime((prevTotal) => prevTotal + 1);
            setIndividualTimes({
              ...individualTimes,
              [currentSpeaker]: (individualTimes[currentSpeaker] || 0) + 1,
            });
            return prevTimer + 1;
          } else {
            nextSpeaker();
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [
    timerActive,
    participants,
    currentSpeakerIndex,
    speakerTimes,
    individualTimes,
    speakingRounds,
    clearTimeOnSwitch,
    countdown,
    displayCurrentSpeaker,
    timerPaused,
  ]);

  const nextSpeaker = () => {
    const nextSpeakerIndex = (currentSpeakerIndex + 1) % participants.length;
    setCurrentSpeakerIndex(nextSpeakerIndex);
    setPreviousSpeakerIndex(currentSpeakerIndex);
    if (clearTimeOnSwitch) {
      setTimer(0);
    }
    setDisplayCurrentSpeaker(true);
  };

  const startMeeting = () => {
    if (participants.length >= 2) {
      setTimerActive(true);
      setDisplayCurrentSpeaker(true);
    }
  };

  const handleSpeakerSwitch = (index) => {
    setCurrentSpeakerIndex(index);
    if (clearTimeOnSwitch) {
      setTimer(0);
    }
    setDisplayCurrentSpeaker(true);
  };

  const switchBackToPreviousSpeaker = () => {
    if (previousSpeakerIndex !== null) {
      handleSpeakerSwitch(previousSpeakerIndex);
    }
  };

  const handleTimeAdjustment = (participant, adjustment) => {
    const currentBaseTime = tempSpeakerTimes[participant] || 15;
    const newTime = currentBaseTime + adjustment;
    setSpeakerTimes({ ...speakerTimes, [participant]: newTime });
    setTempSpeakerTimes({ ...tempSpeakerTimes, [participant]: newTime });
  };

  const moveParticipant = (index, direction) => {
    const newPosition =
      (index + direction + participants.length) % participants.length;
    const newParticipants = [...participants];
    const element = newParticipants.splice(index, 1)[0];
    newParticipants.splice(newPosition, 0, element);
    setParticipants(newParticipants);
    if (currentSpeakerIndex === index) {
      setCurrentSpeakerIndex(newPosition);
    }
  };

  const handleAddParticipant = (event) => {
    event.preventDefault();
    const name = event.target.participantName.value.trim();
    if (name && !participants.includes(name)) {
      setParticipants([...participants, name]);
      setSpeakerTimes({ ...speakerTimes, [name]: 15 });
      setTempSpeakerTimes({ ...tempSpeakerTimes, [name]: 15 });
      setIndividualTimes({ ...individualTimes, [name]: 0 });
      setSpeakingRounds({ ...speakingRounds, [name]: 0 });
      event.target.reset();
    }
  };

  const handleTimeChange = (participant, value) => {
    const newTime = parseInt(value, 10);
    setTempSpeakerTimes({ ...tempSpeakerTimes, [participant]: newTime });
  };

  const submitTimeChange = (participant, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTime = tempSpeakerTimes[participant];
      setSpeakerTimes({ ...speakerTimes, [participant]: newTime });
    }
  };

  const removeParticipant = (participant) => {
    const newParticipants = participants.filter((p) => p !== participant);
    setParticipants(newParticipants);
    if (currentSpeakerIndex >= participants.indexOf(participant)) {
      setCurrentSpeakerIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    }
  };

  const resetTimes = () => {
    setTimer(0);
    setTotalTime(0);
    setSpeakerTimes(
      Object.keys(speakerTimes).reduce(
        (acc, curr) => ({ ...acc, [curr]: 15 }),
        {}
      )
    );
    setIndividualTimes(
      Object.keys(individualTimes).reduce(
        (acc, curr) => ({ ...acc, [curr]: 0 }),
        {}
      )
    );
    setSpeakingRounds(
      Object.keys(speakingRounds).reduce(
        (acc, curr) => ({ ...acc, [curr]: 0 }),
        {}
      )
    );
  };

  const toggleTimerPause = () => {
    setTimerPaused((prevPaused) => !prevPaused);
  };

  return (
    <main className="meeting-facilitator main-welcome">
      {props.showAlert?.alert && (
        <div className="alert-box">
          <h2>{props.alertMessage.message}</h2>
        </div>
      )}
      <div className="start">
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
          <button onClick={() => setShowTimeTracker(!showTimeTracker)}>
            {showTimeTracker ? "Close Time Tracker" : "Open Time Tracker"}
          </button>
        </div>
      </div>
      {showTimeTracker && (
        <div className="time-tracker">
          <h2>Meeting time tracker</h2>
          <div className="total-time">
            {timerActive && displayCurrentSpeaker ? (
              <>
                <h3>
                  This meeting has taken: {Math.floor(totalTime / 60)} minutes
                </h3>
                <h3>
                  Current Speaker: "<b>{participants[currentSpeakerIndex]}</b>"
                  with{" "}
                  <b>
                    {speakerTimes[participants[currentSpeakerIndex]] - timer}s
                  </b>{" "}
                  left
                </h3>
                <button onClick={toggleTimerPause}>
                  {timerPaused ? "Resume Timer" : "Pause Timer"}
                </button>{" "}
              </>
            ) : (
              <>
                <h3>Countdown to next speaker: {countdown}s</h3>
                <h4>
                  <b> Meeting not yet started or waiting for next speaker</b>
                </h4>
              </>
            )}
          </div>
          {participants.length < 2 && (
            <p>At least 2 meeting participants are needed.</p>
          )}
          {participants.length > 1 && (
            <div className="dashboard-parent">
              <h3>Meeting participants in speaking order</h3>
              <div className="dashboard">
                {participants.map((participant, index) => (
                  <div
                    className={`participant-card ${
                      index === currentSpeakerIndex ? "active-speaker" : ""
                    }`}
                    key={index}
                  >
                    <h3>{participant}</h3>
                    <p>Speaking round: {speakingRounds[participant]}</p>
                    <p>Total time spoken: {individualTimes[participant]}s</p>
                    <div className="set-speaking-time">
                      <p>Set time: </p>
                      <input
                        type="number"
                        value={tempSpeakerTimes[participant] || 15}
                        onChange={(e) =>
                          handleTimeChange(participant, e.target.value)
                        }
                        onKeyDown={(e) => submitTimeChange(participant, e)}
                        min="10"
                      />
                    </div>
                    <p>Press "enter" to set new speaking time</p>
                    <button
                      className="increase-time-button"
                      onClick={() => handleTimeAdjustment(participant, 15)}
                    >
                      + 15s speaking time
                    </button>
                    <button
                      className="decrease-time-button"
                      onClick={() => handleTimeAdjustment(participant, -5)}
                    >
                      - 5s speaking time
                    </button>
                    <button
                      className="switch-speaker-button"
                      onClick={() => handleSpeakerSwitch(index)}
                    >
                      Switch to this speaker
                    </button>
                    <button
                      className="switch-back-speaker-button"
                      onClick={switchBackToPreviousSpeaker}
                    >
                      Switch back to previous speaker
                    </button>
                    <div className="move-buttons">
                      <button
                        className="move-left-button"
                        onClick={() => moveParticipant(index, -1)}
                      >
                        {"<"}
                      </button>
                      <button
                        className="move-right-button"
                        onClick={() => moveParticipant(index, 1)}
                      >
                        {">"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="start-meeting-button" onClick={startMeeting}>
                Start meeting!
              </button>
            </div>
          )}

          <h3>Add participants</h3>
          <form
            className="add-participant-form"
            onSubmit={handleAddParticipant}
          >
            <input
              name="participantName"
              type="text"
              placeholder="Enter participant's name"
              required
            />
            <button type="submit">Add Participant</button>
          </form>
          <h3>Remove specific participants</h3>
          <ul className="participant-list">
            {participants.map((participant, index) => (
              <li key={participant}>
                {participant}
                <button
                  className="remove-participant-button"
                  onClick={() => removeParticipant(participant)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
          <button className="reset-times-button" onClick={resetTimes}>
            Reset all times in time tracker
          </button>
        </div>
      )}
    </main>
  );
}
