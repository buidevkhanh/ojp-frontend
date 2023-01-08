import { useEffect, useRef, useState } from "react";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import { userGetProblem } from "../../api/problem.api";
import { useSearchParams } from 'react-router-dom';
import { userGetCategory } from "../../api/category.api";
import { Toaster } from "../commons/toast";
import { Loading } from "../commons/loading";

export default function UserProblem() {
  const [loading, setLoading] = useState();
  const [problem, setProblem] = useState([]);
  const [category, setCategory] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [info, setInfo] = useState();
  const [filter, setFilter] = useState({});
  const name = useRef();
  const code = useRef();
  const level = useRef();
  const categoryId = useRef();
  const subname = useRef();
  const subcode = useRef();
  const sublevel = useRef();
  const subcategoryId = useRef();
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(<></>);
  useEffect(() => {
    const ct = searchParams.get('category') || null;
    setLoading(<Loading/>);
    Promise.all([
      userGetCategory(),
      userGetProblem(page, 20, "level:-1", null, null, null, ct)
    ]).then((response) => {
      setCategory(response[0].data.data);
      setInfo({total: response[1].data.totalItem, size: response[1].data.pageSize, arrlength: response[1].data.data.length})
      setProblem(response[1].data.data);
      setTotalPage(response[1].data.totalPage);
      setLoading();
    })
    // userGetCategory()
    //   .then((data) => {
    //     setCategory(data.data.data);
    //   })
    //   .catch((error) => {
    //     setToast(
    //       <Toaster message={"Unable to connect to server"} type="error" />
    //     );
    //   });
    // userGetProblem(page, 20, "level:-1", null, null, null, ct)
    //   .then((data) => {
    //     setInfo({total: data.data.totalItem, size: data.data.pageSize})
    //     setProblem(data.data.data);
    //     setTotalPage(data.data.totalPage);
    //   })
    //   .catch((error) => {
    //     setToast(
    //       <Toaster message={"Unable to connect to server"} type="error" />
    //     );
    //   });
  }, []);
  const renderProblem = problem
    ? problem.map((item, index) => {
        return (
          <tr key={index}  onClick={() =>
            window.location.replace(`/problem/detail/${item.problemCode}`)
          } className="text-center">
            <td>{item.problemName}</td>
            <td style={{ width: "10%" }}>
              {
                item.isDone ? <i className="fa fa-check-circle text-success" aria-hidden="true"></i> : <i className="fa fa-times-circle text-danger" aria-hidden="true"></i>
              }
            </td>
            <td className="problem__level__td">{item.problemLevel === 'easy' ? 'Dễ' : 'Trung bình'}</td>
            <td className="problem__detail__btn" style={{ width: "15%" }}>
              <div
                className="btn btn-primary"
                onClick={() =>
                  window.location.replace(`/problem/detail/${item.problemCode}`)
                }
              >
                Chi tiết &gt;&gt;
              </div>
            </td>
          </tr>
        );
      })
    : null;
  const renderCategory = category
    ? category.map((item, index) => {
        return (
          <option value={item._id} key={index}>
            {item.categoryName}
          </option>
        );
      })
    : null;
  function clearFilter() {
    name.current.value = "";
    code.current.value = "";
    level.current.value = "-1";
    categoryId.current.value = "-1";
    setFilter({
      name: name.current.value,
      code: code.current.value,
      level: level.current.value,
      category: categoryId.current.value,
    });
  }

  function clearSubFilter() {
    name.current.value = "";
    code.current.value = "";
    level.current.value = "-1";
    categoryId.current.value = "-1";
    subname.current.value = "";
    subcode.current.value = "";
    sublevel.current.value = "-1";
    subcategoryId.current.value = "-1";
    setFilter({
      name: name.current.value,
      code: code.current.value,
      level: level.current.value,
      category: categoryId.current.value,
    });
  }

  function changePage(delta) {
    setPage(delta);
    callFilter(delta);
  }
  function changeFilter() {
    setFilter({
      name: name.current.value,
      code: code.current.value,
      level: level.current.value,
      category: categoryId.current.value,
    });
  }
  function changeSubFilter() {
    name.current.value = subname.current.value;
    code.current.value = subcode.current.value;
    level.current.value = sublevel.current.value;
    categoryId.current.value = subcategoryId.current.value;
    setFilter({
      name: name.current.value,
      code: code.current.value,
      level: level.current.value,
      category: categoryId.current.value,
    });
  }
  function callFilter(delta) {
    setLoading(<Loading/>)
    userGetProblem(
      delta ? delta : page,
      20,
      "level:-1",
      filter.name,
      filter.code,
      filter.level !== "-1" ? filter.level : null,
      filter.category !== "-1" ? filter.category : null
    )
      .then((data) => {
        setProblem(data.data.data);
        setTotalPage(data.data.totalPage);
        setLoading();
        setInfo({total: data.data.totalItem, size: data.data.pageSize, arrlength: data.data.data.length})
      })
      .catch((error) => {
        setToast(<Toaster message="Unbale to send request" type="error" />);
      });
  }
  function callNoFilter(delta) {
    userGetProblem(
      delta ? delta : page,
      20,
      "level:-1"
    )
      .then((data) => {
        setProblem(data.data.data);
        setTotalPage(data.data.totalPage);
        setInfo({total: data.data.totalItem, size: data.data.pageSize, arrlength: data.data.data.length})
      })
      .catch((error) => {
        setToast(<Toaster message="Unbale to send request" type="error" />);
      });
  }
  return (
    <>
      {loading}
      {toast}
      <NavigationBar />
      <div className="container py-4 problem__bound">

      <div className="sub-filter">
        <h3 className="bold text-secondary">Bộ lọc</h3>
        <input
                ref={subname}
                onChange={() => changeSubFilter()}
                className="input__form__input my-1"
                type="text"
                placeholder="Từ khóa tìm kiếm..."
              ></input>
              <input
                onChange={() => changeSubFilter()}
                ref={subcode}
                className="input__form__input my-1"
                type="text"
                placeholder="Mã bài toán..."
              ></input>
              <select
                ref={sublevel}
                onChange={() => changeSubFilter()}
                defaultValue={"-1"}
                className="input__form__input my-1"
              >
                <option value="-1">--- Chọn mức độ ---</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung Bình</option>
              </select>
              <select
                onChange={() => changeSubFilter()}
                ref={subcategoryId}
                defaultValue={"-1"}
                className="input__form__input"
              >
                <option value="-1">--- Chọn danh mục ---</option>
                {renderCategory}
              </select>
              <div className="w-100 text-center">
                <div className="btn btn-success my-1" onClick={() => callFilter()}>
                  Lọc bài toán
                </div>
                <div
                  className="btn btn-danger mx-2 my-1"
                  onClick={() => {clearSubFilter(); callNoFilter()}}
                >
                  Xóa lọc
                </div>
              </div>
        </div>
        <h3 className="bold text-secondary">Danh sách bài toán</h3>
        <div className="row">
          <p>Hiển thị {info?.total <= info?.arrlength ? info?.total + " trên tổng số " + info?.total : info?.arrlength + " trên tổng số " + info?.total} bài</p>
          <div className="col-lg-8 my-1">
            <div className="table table-hover border">
              <thead>
                <tr className="text-center">
                  <th>Tên bài</th>
                  <th style={{ width: "10%"}}>Đã giải quyết</th>
                  <th style={{ width: "5%" }}>Mức độ</th>
                </tr>
              </thead>
              <tbody>{renderProblem}</tbody>
            </div>
            {+totalPage > 1 ? (
              <nav aria-label="navigation mt-2">
                <ul className="pagination mt-2 text-center d-flex justify-content-center">
                  {page - 1 > 0 ? (
                    <li onClick={() => changePage(page - 1)} className="page-item">
                      <span className="page-link" href="#">
                        Trước
                      </span>
                    </li>
                  ) : null}
                  <li className="page-item">
                    <span
                      className="page-link"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#e9ecef",
                      }}
                    >
                      {page}
                    </span>
                  </li>

                  {page + 1 <= totalPage ? (
                    <li onClick={() => changePage(page + 1)} className="page-item">
                      <span className="page-link">{page + 1}</span>
                    </li>
                  ) : null}
                  {page + 2 <= totalPage ? (
                    <li onClick={() => changePage(page + 2)} className="page-item">
                      <span className="page-link">{page + 2}</span>
                    </li>
                  ) : null}
                </ul>
              </nav>
            ) : null}
          </div>
          <div className="col-lg-4 my-1">
            <div className="problem__filter px-4 py-3 border">
              <h4>Bộ lọc bài toán</h4>
              <input
                ref={name}
                onChange={() => changeFilter()}
                className="input__form__input my-1"
                type="text"
                placeholder="Từ khóa tìm kiếm..."
              ></input>
              <input
                onChange={() => changeFilter()}
                ref={code}
                className="input__form__input my-1"
                type="text"
                placeholder="Mã bài toán..."
              ></input>
              <select
                ref={level}
                onChange={() => changeFilter()}
                defaultValue={"-1"}
                className="input__form__input my-1"
              >
                <option value="-1">--- Chọn mức độ ---</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung Bình</option>
              </select>
              <select
                onChange={() => changeFilter()}
                ref={categoryId}
                defaultValue={"-1"}
                className="input__form__input"
              >
                <option value="-1">--- Chọn danh mục ---</option>
                {renderCategory}
              </select>
              <div className="btn btn-success my-1" onClick={() => callFilter()}>
                Lọc bài toán
              </div>
              <div
                className="btn btn-danger mx-2 my-1"
                onClick={() => {clearFilter(); callNoFilter()}}
              >
                Xóa lọc
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
