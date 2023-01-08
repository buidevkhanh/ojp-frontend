import { ScaleLoader } from "react-spinners";


export function Loading() {
  const loader = <ScaleLoader color="#2f3ea3" speedMultiplier={1.5} size="50" />;
  return (
    <div className="position-fixed page__loader d-flex justify-content-center align-items-center flex-column" style={{zIndex: 1080, width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: 'rgba(255,255,255,1)'}}>
      <div
        className="loader__bound d-flex p-3"
      >
        {loader}
      </div>
      <p className="text_secondary mt-2 text-dark">Đang tải dữ liệu ! Vui lòng đợi</p>
    </div>
  );
}
