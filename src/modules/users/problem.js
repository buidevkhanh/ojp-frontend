import { useEffect, useRef, useState } from "react";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import { userGetProblem } from "../../api/problem.api";
import { userGetCategory } from "../../api/category.api";
import { Toaster } from "../commons/toast";

export default function UserProblem() {
  const [problem, setProblem] = useState([]);
  const [category, setCategory] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState({});
  const name = useRef();
  const code = useRef();
  const level = useRef();
  const categoryId = useRef();
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(<></>);
  useEffect(() => {
    userGetCategory()
      .then((data) => {
        setCategory(data.data.data);
      })
      .catch((error) => {
        setToast(
          <Toaster message={"Unable to connect to server"} type="error" />
        );
      });
    userGetProblem(page, 20, "level:-1")
      .then((data) => {
        setProblem(data.data.data);
        setTotalPage(data.data.totalPage);
      })
      .catch((error) => {
        setToast(
          <Toaster message={"Unable to connect to server"} type="error" />
        );
      });
  }, []);
  const renderProblem = problem
    ? problem.map((item, index) => {
        return (
          <tr key={index} class="text-center">
            <td style={{ width: "5%" }}>{(index + 1) * page}</td>
            <td>{item.problemName}</td>
            <td style={{ width: "5%" }}>
              <i class="fa fa-times-circle text-danger" aria-hidden="true"></i>
            </td>
            <td style={{ width: "10%" }}>{item.problemLevel}</td>
            <td style={{ width: "15%" }}>
              <div
                class="btn btn-primary"
                onClick={() =>
                  window.location.replace(`/problem/detail/${item.problemCode}`)
                }
              >
                Resolve
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
  function changePage(delta) {
    setPage(delta);
    callFilter(delta);
  }
  function callFilter(delta) {
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
      })
      .catch((error) => {
        setToast(<Toaster message="Unbale to send request" type="error" />);
      });
  }
  return (
    <>
      {toast}
      <NavigationBar />
      <div class="container py-4">
        <h3 class="bold text-secondary">All Problems</h3>
        <div class="row">
          <div class="col-md-8">
            <div class="table table-hover border">
              <thead>
                <tr class="text-center">
                  <th style={{ width: "5%" }}>#</th>
                  <th>Name</th>
                  <th style={{ width: "5%" }}>Status</th>
                  <th style={{ width: "5%" }}>Level</th>
                  <th style={{ width: "5%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>{renderProblem}</tbody>
            </div>
            {+totalPage >= 1 ? (
              <nav aria-label="navigation mt-2">
                <ul class="pagination mt-2 text-center d-flex justify-content-center">
                  {page - 1 > 0 ? (
                    <li onClick={() => changePage(page - 1)} class="page-item">
                      <span class="page-link" href="#">
                        Pre
                      </span>
                    </li>
                  ) : null}
                  <li class="page-item">
                    <span
                      class="page-link"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#e9ecef",
                      }}
                    >
                      {page}
                    </span>
                  </li>

                  {page + 1 <= totalPage ? (
                    <li onClick={() => changePage(page + 1)} class="page-item">
                      <span class="page-link">{page + 1}</span>
                    </li>
                  ) : null}
                  {page + 2 <= totalPage ? (
                    <li onClick={() => changePage(page + 2)} class="page-item">
                      <span class="page-link">{page + 2}</span>
                    </li>
                  ) : null}
                </ul>
              </nav>
            ) : null}
          </div>
          <div class="col-md-4">
            <div class="filter px-4 py-3 border">
              <h4>Filter</h4>
              <input
                ref={name}
                class="input__form__input my-1"
                type="text"
                placeholder="Problem name ..."
              ></input>
              <input
                ref={code}
                class="input__form__input my-1"
                type="text"
                placeholder="Problem code ..."
              ></input>
              <select
                ref={level}
                defaultValue={"-1"}
                class="input__form__input my-1"
              >
                <option value="-1">Select level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
              </select>
              <select
                ref={categoryId}
                defaultValue={"-1"}
                class="input__form__input"
              >
                <option value="-1">Category</option>
                {renderCategory}
              </select>
              <div class="btn btn-success my-1" onClick={() => callFilter()}>
                Accept
              </div>
              <div
                class="btn btn-danger mx-2 my-1"
                onClick={() => clearFilter()}
              >
                Clear filter
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
