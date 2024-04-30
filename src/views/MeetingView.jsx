import React, { useState, useEffect } from "react";

export default function MeetingView(props) {
  const [participants, setParticipants] = useState([]);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [speakerTimes, setSpeakerTimes] = useState({});

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
            return 0; // återställ tidtagaruret..
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
      event.target.reset();
    }
  };

  return (
    <main class="meetingFacilitator main-welcome">
      {props.showAlert?.alert && (
        <div class="alert-box">
          <h2>{props.alertMessage.message}</h2>
        </div>
      )}
      <div class="start">
        <h2>Hold a meeting</h2>
        <div class="welcome-view">
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
        </div>
      </div>
      <div class="time-tracker">
        <h3>Time tracker</h3>

        <form onSubmit={handleAddParticipant}>
          <input
            name="participantName"
            type="text"
            placeholder="Enter participant's name"
            required
          />
          <button type="submit">Add Participant</button>
        </form>
      </div>
      <div class="dashboard">
        {participants.length > 0 && (
          <>
            <div class="participant-card">
              <h4>Current Speaker: {participants[currentSpeakerIndex]}</h4>
              <p>Time ticking... {timer}s</p>
            </div>
            {participants.map((participant, index) => (
              <div class="participant-card" key={index}>
                <h3>{participant}</h3>
                <p>Allocated Time: {speakerTimes[participant] || 60}s</p>
                <input
                  type="number"
                  value={speakerTimes[participant] || 60}
                  onChange={(e) =>
                    setSpeakerTimes({
                      ...speakerTimes,
                      [participant]: parseInt(e.target.value),
                    })
                  }
                  min="10"
                />
                <button
                  onClick={() => {
                    const newTime = (speakerTimes[participant] || 60) + 10;
                    setSpeakerTimes({
                      ...speakerTimes,
                      [participant]: newTime,
                    });
                  }}
                >
                  +10s
                </button>
                <button
                  onClick={() => {
                    const newTime = (speakerTimes[participant] || 60) - 10;
                    setSpeakerTimes({
                      ...speakerTimes,
                      [participant]: newTime,
                    });
                  }}
                >
                  -10s
                </button>
                <button
                  onClick={() => {
                    setCurrentSpeakerIndex(index);
                    setTimer(0);
                  }}
                >
                  Switch to Speaker
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
