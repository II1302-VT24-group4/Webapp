import React, { useState, useEffect, useRef, useCallback } from "react";
import "/src/styles/welcome.css"; // Import the CSS file from the styles directory

function WelcomeView(props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const AUDIO_PATHS = {
    page1: "src/audio/tutorial/page-1.mp3",
    page2: "src/audio/tutorial/page-2.mp3",
    page3: "src/audio/tutorial/page-3.mp3",
    page4: "src/audio/tutorial/page-4.mp3",
    thehardware: "src/audio/tutorial/the-hardware.mp3",
  };
  const [soundSettings, setSoundSettings] = useState({
    thehardware: true,
    page1: true,
    page2: true,
    page3: true,
    page4: true,
  });
  const playAudio = (key, callback) => {
    if (audioRef.current && AUDIO_PATHS[key] && soundSettings[key]) {
      if (isSpeaking) {
        setTimeout(() => playAudio(key, callback), 1000);
        return;
      }

      audioRef.current.src = AUDIO_PATHS[key];
      audioRef.current
        .play()
        .then(() => {
          setAudioPlayed(true);
          audioRef.current.onended = () => {
            if (callback) {
              callback();
            }
          };
        })
        .catch((error) => console.error("Error playing audio:", error));
    }
  };
  return (
    <div className="custom-welcome-container">
      <audio ref={audioRef} preload="all"></audio>

      {/* Updated Welcome Content */}
      <main className="custom-main-welcome">
        <h2>Get started with the Meeting Planner</h2>
        {/* Container for flexible grid layout */}
        <div className="custom-welcome-grid">
          <div className="custom-welcome-item">
            {/* Title */}
            <h3 className="custom-welcome-view-heading">
              The Hardware: The Meeting Room Controller
            </h3>
            {/* Image - Discussion Icon */}
            <img
              src="/src/styles/discussion.png"
              alt="Discussion Icon"
              style={{
                width: "95px",
                height: "95px",
                display: "block",
                margin: "0 auto",
                marginTop: "0px", // Adjusted margin to reduce space
              }}
            />
            {/* Content */}
            <p className="custom-welcome-view-paragraph">
              The Room Display Controller is positioned at the entrance of each
              meeting room. On the screen, you can:
              <ol>
                <li>Check the room’s current status.</li>
                <li>Check for other available rooms.</li>
                <li>Check the current time.</li>
                <li>
                  Book meetings on-the-spot with your personal access card.
                </li>
              </ol>
            </p>
            <button
              class="read-aloud-button"
              onClick={() => playAudio("thehardware")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                alt=""
              />
            </button>
          </div>
          {/* First grid item */}
          <div className="custom-welcome-item">
            <h3 className="custom-welcome-view-heading">Page 1. My Calendar</h3>
            {/* Image - Schedule Icon */}
            <img
              src="/src/styles/schedule.png"
              alt="Schedule Icon"
              style={{
                width: "100px",
                height: "100px",
                display: "block",
                margin: "0 auto",
                marginTop: "20px",
              }}
            />
            {/* Content */}
            <p className="custom-welcome-view-paragraph">asd</p>
            <button
              class="read-aloud-button"
              onClick={() => playAudio("page1")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                alt=""
              />
            </button>
          </div>
          {/* Second grid item */}
          <div className="custom-welcome-item">
            {/* Title */}
            <h3 className="custom-welcome-view-heading">
              Page 2. Bookable Rooms
            </h3>
            {/* Image - Meeting Icon */}
            <img
              src="/src/styles/meeting.png"
              alt="Meeting Icon"
              style={{
                width: "100px",
                height: "100px",
                display: "block",
                margin: "0 auto",
                marginTop: "20px",
              }}
            />
            {/* Content */}
            <p className="custom-welcome-view-paragraph">asd</p>
            <button
              class="read-aloud-button"
              onClick={() => playAudio("page2")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                alt=""
              />
            </button>
          </div>
          {/* Third grid item */}
          <div className="custom-welcome-item">
            {/* Title */}
            <h3 className="custom-welcome-view-heading">
              Page 3. Room Favourites List
            </h3>
            {/* Image - Discussion Icon */}
            <img
              src="/src/styles/discussion.png"
              alt="Discussion Icon"
              style={{
                width: "95px",
                height: "95px",
                display: "block",
                margin: "0 auto",
                marginTop: "0px", // Adjusted margin to reduce space
              }}
            />
            {/* Content */}
            <p className="custom-welcome-view-paragraph">
              <p>
                At the "Room Favourites List", you can quickly access and book
                rooms you prefer or find the most convenient. To add rooms to
                your favourites:
              </p>
              <ol>
                <li>Visit the "Bookable Rooms" page.</li>
                <li>Open the "Book by specific room" view.</li>
                <li>
                  Press "Add to Favourites" on one of your preferred rooms.
                </li>
              </ol>
            </p>
            <button
              class="read-aloud-button"
              onClick={() => playAudio("page3")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                alt=""
              />
            </button>
          </div>
          <div className="custom-welcome-item">
            {/* Title */}
            <h3 className="custom-welcome-view-heading">
              Page 4. Hold a Meeting
            </h3>
            {/* Image - Discussion Icon */}
            <img
              src="/src/styles/discussion.png"
              alt="Discussion Icon"
              style={{
                width: "95px",
                height: "95px",
                display: "block",
                margin: "0 auto",
                marginTop: "0px", // Adjusted margin to reduce space
              }}
            />
            {/* Content */}
            <div className="meeting-technique-guidance">
              <p className="custom-welcome-view-paragraph">
                The Meeting Helper optimizes and democratizes speaking times. A
                designated 'meeting leader' should always keep this page open,
                as all important announcements will be made audibly to the
                group. To customize the meeting for each team, the meeting
                leader can among other things set speaker changes to occur
                automatically or manually and decide whether the page should
                announce when it's time for the next person to speak. There are
                three meeting technique presets:
                <ol>
                  <li>Regular Meeting</li>
                  <li>Briefing/presentation meeting</li>
                  <li>Negotiation Meeting</li>
                </ol>
              </p>
            </div>

            <div className="meeting-technique-guidance">
              <p className="custom-welcome-view-paragraph">
                <b>
                  Note: This page can, unlike Pages 1-3 be used independently of
                  any meeting rooms.
                </b>
              </p>
            </div>
            <button
              class="read-aloud-button"
              onClick={() => playAudio("page4")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                alt=""
              />
            </button>
          </div>

          {/* Repeat for additional rows */}
        </div>
      </main>
    </div>
  );
}

export default WelcomeView;
