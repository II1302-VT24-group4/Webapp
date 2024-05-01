import React from "react";
import "/src/styles/welcome.css"; // Import the CSS file from the styles directory

function WelcomeView(props) {
  return (
    <div className="custom-welcome-container">
      {/* Updated Welcome Content */}
      <main className="custom-main-welcome">
        <h2>Get Started with The Meeting Planner</h2>
        {/* Container for flexible grid layout */}
        <div className="custom-welcome-grid">
          {/* First grid item */}
          <div className="custom-welcome-item">
            {/* Title */}
            <h3 className="custom-welcome-view-heading">Personalised Calender</h3>
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
            <p className="custom-welcome-view-paragraph">
              Streamline your meetings by booking directly on your personal calendar with our intuitive scheduler. Seamlessly invite multiple participants from your company. Enhance productivity by attaching documents and taking notes—all within your calendar event.
            </p>
          </div>

          {/* Second grid item */}
          <div className="custom-welcome-item">
            {/* Title */}
            <h3 className="custom-welcome-view-heading">Book Meeting Rooms</h3>
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
            <p className="custom-welcome-view-paragraph">
              Discover an effortless way to book meeting rooms at your office. Access our comprehensive schedule of available rooms, and personalize your experience by marking favorite rooms for quick access and streamlined booking.
            </p>
          </div>

          {/* Third grid item */}
          <div className="custom-welcome-item">
            {/* Title */}
            <h3 className="custom-welcome-view-heading">Meeting Facilitator</h3>
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
            Explore a comprehensive meeting facilitator page offering diverse techniques for group meetings. Utilize our time tracker tool to ensure equitable participation by allocating time equally among meeting participants.
            </p>
          </div>

          {/* Repeat for additional rows */}
        </div>
      </main>
    </div>
  );
}

export default WelcomeView;
