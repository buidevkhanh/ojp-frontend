import { HashLoader } from "react-spinners";

export function Loading() {
  const loader = <HashLoader color="#2f3ea3" speedMultiplier={1.5} size="50" />;
  return (
    <div class="position-fixed full__width full__height page__loader d-flex justify-content-center align-items-center flex-column">
      <p class="text_secondary">Loading data, please wait...</p>
      <div
        class="loader__bound d-flex p-3"
        style={{ border: "2px solid #2f3ea3", borderRadius: "50%" }}
      >
        {loader}
      </div>
    </div>
  );
}
