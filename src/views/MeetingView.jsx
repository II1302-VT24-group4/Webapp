import React, { useState, useEffect } from "react";
//usestate returnerar tillståndsvärde och funktion som kan uppdatera det värdet
//kan initialiseras useState(värde)

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
  const [clearTimeOnSwitch, setClearTimeOnSwitch] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [displayCurrentSpeaker, setDisplayCurrentSpeaker] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [meetingHasBegun, setMeetingHasBegun] = useState(false);

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
          //passa in tidigare timer och uppdatera
          const currentSpeaker = participants[currentSpeakerIndex]; //hämta korrekt participant
          const currentSpeakerTime = speakerTimes[currentSpeaker] || 15;
          if (prevTimer < currentSpeakerTime) {
            //om tiden inte har nått gränsen
            setTotalTime((prevTotal) => prevTotal + 1); //använd funktionen prevTotal som inpassat värde som är en funktion som adderar med 1
            setIndividualTimes({
              ...individualTimes,
              [currentSpeaker]: (individualTimes[currentSpeaker] || 0) + 1,
            });
            return prevTimer + 1;
          } else {
            nextSpeaker();
            return 0; //återställ timer
          }
        });
      }, 1000); //1000 ms = 1 s
    } else {
      clearInterval(intervalId); //setInterval rensas direkt om någon av villkoren inte uppfylls, enbart med hjälp av clearInterval. stoppas funktionskörning mitt i om villkor inte gäller???
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
    setTimerActive(false);
    setCountdown(3);
    let countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(countdownInterval);
          const nextSpeakerIndex =
            (currentSpeakerIndex + 1) % participants.length;
          setCurrentSpeakerIndex(nextSpeakerIndex);
          setPreviousSpeakerIndex(currentSpeakerIndex);
          if (clearTimeOnSwitch) {
            setTimer(0);
          }
          setDisplayCurrentSpeaker(true);
          setTimerActive(true);
          return 0;
        }
      });
    }, 1000);
  };
  const activateTimerIfValid = () => {
    const currentSpeaker = participants[currentSpeakerIndex];
    const currentSpeakerTime = speakerTimes[currentSpeaker];
    if (currentSpeakerTime > 0) {
      setTimerActive(true);
      setDisplayCurrentSpeaker(true);
    } else {
      setTimerActive(false);
      setDisplayCurrentSpeaker(false);
      nextSpeaker();
    }
  };
  const startMeeting = () => {
    if (participants.length >= 2) {
      setTimerActive(false); // inaktivera timer under nedräkning
      setCountdown(3);
      let countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(countdownInterval); //stoppa nedräkning vid 0
            const currentSpeaker = participants[currentSpeakerIndex];
            const currentSpeakerTime = speakerTimes[currentSpeaker] || 0;
            if (currentSpeakerTime > 0) {
              setTimerActive(true); //aktivera timer om talare har giltig tid
              setDisplayCurrentSpeaker(true);
            } else {
              alert(
                "Current speaker does not have a valid time set. Please adjust time to start."
              );
            }
            return 0;
          }
        });
      }, 1000);
    }
  };

  const handleSpeakerSwitch = (index) => {
    setTimerActive(false);
    setCountdown(3);
    let countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(countdownInterval);
          setCurrentSpeakerIndex(index);
          if (clearTimeOnSwitch) {
            setTimer(0);
          }
          setDisplayCurrentSpeaker(true);
          setTimerActive(true);
          return 0;
        }
      });
    }, 1000);
  };

  const switchBackToPreviousSpeaker = () => {
    if (previousSpeakerIndex !== null) {
      handleSpeakerSwitch(previousSpeakerIndex);
    }
  };

  const handleTimeAdjustment = (participant, adjustment) => {
    const currentBaseTime = tempSpeakerTimes[participant] || 15;
    const newTime = Math.max(0, currentBaseTime + adjustment); //får ej vara under 0
    setSpeakerTimes({ ...speakerTimes, [participant]: newTime });
    setTempSpeakerTimes({ ...tempSpeakerTimes, [participant]: newTime });
  };

  const moveParticipant = (index, direction) => {
    const newPosition =
      (index + direction + participants.length) % participants.length;
    const newParticipants = [...participants];
    const element = newParticipants.splice(index, 1)[0]; //splice(startindex, antal att ta bort)[att lägga in istället (annars krymper listans längd)]
    newParticipants.splice(newPosition, 0, element);
    setParticipants(newParticipants); //uppdatera med funktion som vi har fått av usestate hooken -> resulterar i omrendering
    if (currentSpeakerIndex === index) {
      //om den som flyttades är nuvarande speaker
      setCurrentSpeakerIndex(newPosition);
    }
  };

  const handleAddParticipant = (event) => {
    //texten i formuläret passas in
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
    const newTime = Math.max(0, parseInt(value, 10)); //får inte vara under 0
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
    const newParticipants = participants.filter((p) => p !== participant); //filter-metoden går igenom varje element i listan och inkluderar det i den nya listan endast om det uppfyller det angivna villkoret.
    //om p i listan inte är lika med den inpassande participant läggs den till i arrayen newParticipants.
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
                  This meeting has taken: {Math.floor(totalTime / 60)} minutes{" "}
                  {/* and {totalTime-Math.floor(totalTime / 60)}s */}
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
                </button>
              </>
            ) : (
              <>
                <h3>
                  {countdown > 0
                    ? `Countdown for next speaker: ${countdown}s`
                    : "No time left for current speaker"}
                </h3>
                <h4>
                  <b>
                    {!timerActive && countdown === 0
                      ? "Adjust time to continue"
                      : "Meeting paused"}
                  </b>
                </h4>
              </>
            )}
          </div>
          {participants.length < 2 && (
            <p>At least 2 meeting participants are needed.</p>
          )}
          {participants.length > 1 && (
            <div className="dashboard-parent">
              <h3 class="rubric">Meeting participants in speaking order</h3>
              <div className="dashboard">
                {participants.map((participant, index) => (
                  <div
                    className={`participant-card ${
                      index === currentSpeakerIndex ? "active-speaker" : ""
                    }`}
                    key={index}
                  >
                    <h3>{participant}</h3>
                    {/* <p>Speaking round: {speakingRounds[participant]}</p>*/}
                    <p>
                      Total time spoken:{" "}
                      {Math.floor(individualTimes[participant] / 60)} minutes
                    </p>
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
                    {/*<button
                      className="switch-back-speaker-button"
                      onClick={switchBackToPreviousSpeaker}
                    >
                      Switch back to previous speaker
                    </button> */}
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
              <button className="reset-times-button" onClick={resetTimes}>
                Reset time
              </button>
              {!meetingHasBegun && (
                <>
                  <button
                    className="start-meeting-button"
                    onClick={() => {
                      setMeetingHasBegun(true);
                      startMeeting();
                    }}
                  >
                    Start meeting!
                  </button>
                </>
              )}
            </div>
          )}
          <div class="meeting-config">
            <h3 class="rubric"> Meeting configuration</h3>
            <h4>Add participants</h4>
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
            <h4>Remove specific participants</h4>
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

            <label>
              <input
                type="checkbox"
                checked={clearTimeOnSwitch}
                onChange={() => setClearTimeOnSwitch(!clearTimeOnSwitch)}
              />
              Clear remaining time of previous speaker when manually switching
              to new speaker
            </label>
          </div>
        </div>
      )}
    </main>
  );
}
