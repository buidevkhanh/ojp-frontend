import { useEffect, useState } from "react";
import { userGetCategory } from "../../api/category.api";
import { statistic, userGetProblem } from "../../api/problem.api";
import Footer from "../commons/footer";
import { Loading } from "../commons/loading";
import NavigationBar from "../commons/navigation";
import Activities from "./activity";

function UserHome() {
  const [categoryList, setCategoryList] = useState([]);
  const [problemList, setProblemList] = useState([]);
  const [loading, setLoading] = useState();
  const [stats, setStats] = useState();
  useEffect(() => {
    setLoading(<Loading/>);
    Promise.all([
      userGetCategory(),
      userGetProblem(1, 10, "createdAt:-1"),
      statistic()
    ]).then((result) => {
      setCategoryList(result[0].data.data);
      setProblemList(result[1].data.data);
      setStats(result[2].data.result);
      setLoading();
    })
    // userGetCategory().then((data) => {
    //   setCategoryList(data.data.data);
    // });
    // userGetProblem(1, 10, "createdAt:-1").then((data) => {
    //   setProblemList(data.data.data);
    // });
    // statistic().then((data) => {
    //   setStats(data.data.result);
    // })
  }, []);

  const renderCategory = categoryList
    ? categoryList.map((item, index) => {
        return (
          <li
            key={index}
            onClick={() => window.location.replace(`/problem?category=${item._id.toString()}`)}
            className="category__item d-inline-block mx-1 my-1"
            style={{
              borderRadius: "5px",
              height: "120px",
              boxShadow: "0 0 1px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="d-flex flex-column justify-content-center align-items-center w-100"
              style={{ height: "100%" }}
            >
              <div
                className="category__logo"
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid gray",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('${item.categoryLogo}')`,
                    backgroundSize: `cover`,
                    backgroundRepeat: `no-repeat`
                  }}
                ></div>
              </div>
              <p className="text-dark m-0 mt-2">{item.categoryName}</p>
            </div>
          </li>
        );
      })
    : null;
  const renderProblemList = problemList
    ? problemList.map((item, index) => {
        return (
          <li key="index" onClick={()=> window.location.replace(`/problem/detail/${item.problemCode}`)}className="px-2 py-3 new__problem cursor m-auto" style={{borderBottom: '1px solid #e6e6e6'}}>
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0 p-0 d-inline-block text-center home__level" style={{fontWeight: 'normal', width: '10%'}}>
                  {item.problemLevel === 'easy' ? 
                    <p className="badge badge-opacity-success home__level">Dễ</p> :
                    <p className="badge badge-opacity-warning  home__level">Trung bình</p>
                  }
                </h5>
                <h5 className="m-0 p-0 d-inline-block text-center" style={{fontWeight: 'normal', width: '50%'}}>
                 {item.problemName}
                </h5>
                <h5 className="m-0 p-0 d-inline-block text-end text-danger" style={{fontWeight: 'normal', width: '40%'}}>
                 Số điểm: {item.score || 1}
                </h5>
              </div>
            </div>
          </li>
        );
      })
    : null;
  return (
    <>
      {loading}
      <NavigationBar />
      <div className="container mb-5">
        <h3 className="bold mt-4 text-secondary" style={{ fontWeight: "bold" }}>
          Các danh mục
        </h3>
        <ul className="category__list d-block px-5 my-4">{renderCategory}</ul>
        <h3 className="bold mt-4 text-secondary mb-3" style={{ fontWeight: "bold" }}>
          Nổi bật
        </h3>
        <div className="row px-5 container">
          <div className="col-md-8 py-2">
            <h3 className="m-0 my-2"><i className="far fa-clipboard mx-1"></i>Bài toán mới</h3>
            <ul style={{listStyle: 'none'}}>
              {renderProblemList}
            </ul>
          </div>
          <div className="col-md-4">
            <div className="px-3 py-2" style={{border: '1px solid #e3e3e3', borderRadius: '10px'}}>
              <h3 className="m-0 my-2"><i className="fab fa-connectdevelop mx-1"></i>Thống kê</h3>
              <h5 className="m-0 p-0 my-2 mx-1">Số bài tập: {stats?.totalProblem || 'N/A'} </h5>
              <h5 className="m-0 p-0 my-2 mx-1">Số thành viên: {stats?.totalUser || 'N/A'}</h5>
              <h5 className="m-0 p-0 my-2 mx-1">Số submit: {stats?.totalSubmission || 'N/A'}</h5>
            </div>
          </div>
        </div>
        <h3 className="bold mt-4 text-secondary" style={{ fontWeight: "bold" }}>
          Chuyên mục
        </h3>
        <div className="activity d-flex justify-content-center align-items-start">
          <div className="row w-100">
            <div className="col-md-7 text-center d-flex justify-content-start align-items-start flex-column">
              <h3 className="m-0 my-2"><i className="fas fa-link mx-1"></i>Thông tin hữu ích</h3>
              <img className="m-auto" src="https://cdn.codegym.vn/wp-content/uploads/2020/02/muc-luong-lap-trinh-vien-tai-viet-nam-codegym-4-2.jpg"/>
              <i className="d-block w-100 text-center">Mức lương trung bình của lập trình viên theo kỹ năng 2022  </i>
            </div>
            <div className="col-md-5 text-center">
              <h3 className="m-0 my-2 w-100 text-start"><i className="fas fa-road mx-1"></i>Hoạt động của bạn</h3>
              <Activities />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default UserHome;
