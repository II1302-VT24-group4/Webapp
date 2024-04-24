import { renderCategory } from "./RoomCategoryRenderer";

export default function HomeView(props) {
  return (
    <main>
      {props.showAlert?.alert && (
        <div class="alert-box">
          <h2>{props.alertMessage.message}</h2>
        </div>
      )}
      <h2>Home</h2>
    </main>
  );
}
