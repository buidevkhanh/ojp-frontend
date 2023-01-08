export default function Footer(props) {
  return (
    <>
    {props.scope !== 'limited' ?
    <footer className="footer-section" style={{ height: "fit-content"}}>
      <div className="footer text-center text-white" style={{backgroundColor: '#120851' }}>
          <p className="w-50 m-auto">
            OnlineJudge là hệ thống chấm bài trực tuyến hỗ trợ nhiều ngôn ngữ lập trình. Với mục đích giúp người dùng của hệ thống 
            học tập và luyện tập kỹ năng lập trình cũng như khả năng tư duy và giải quyết tình huống. Sản phẩm này là đồ án tốt nghiệp của 
            sinh viên Bùi Đức Khanh - B18DCCN303 - Học viện Công nghệ Bưu chính Viễn thông.
          </p>
      </div>
    </footer> : null }
    </>
  );
}
