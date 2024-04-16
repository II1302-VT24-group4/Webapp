export default function WelcomeView(props) {
  return (
    <main className="main-welcome">
      <h2>Welcome page</h2>
      <div className="welcome-view">
        <h3>Welcome!</h3>
        <p>
          Meeting Planner is a comprehensive system designed to streamline the
          management of meeting rooms. This system includes both a physical unit
          and a user-friendly website for booking meeting rooms. The physical
          device is equipped with a display that shows relevant information
          about booked meetings and room availability, while this website
          enables personal booking and offers many functions during the meeting.
        </p>
        <p>
          The meeting leader should have the app open on their app during the
          meeting.
        </p>
        <p>
          Sign in with your Google account and access the booking rooms of your
          organization.
        </p>
      </div>
    </main>
  );
}
