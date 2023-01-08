import { HashLoader } from "react-spinners";


export function Loading() {
  const loader = <HashLoader color="#2f3ea3" speedMultiplier={1.5} size="50" />;
  return (
    <div className="position-fixed full__width full__height page__loader d-flex justify-content-center align-items-center flex-column" style={{zIndex: 1080, backgroundColor: 'rgba(0,0,0,1)'}}>
      <div
        className="loader__bound d-flex p-3"
        style={{ border: "2px solid #2f3ea3", borderRadius: "50%" }}
      >
        {loader}
      </div>
      <p className="text_secondary mt-2 text-white">Đang tải dữ liệu ! Vui lòng đợi</p>
    </div>
  );
}
