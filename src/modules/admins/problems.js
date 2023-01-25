import { useEffect, useState } from "react";
import { callChangeStatus, callGetProblem } from "../../api/problem.api";
import { AppAction, FormType } from "../../helpers/object.helper";
import { Toaster } from "../commons/toast";
import Form from "./form";
import { Loading } from "./loading";

function Problem() {
  const [form, setForm] = useState(<></>);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState();
  const [toast, setToast] = useState(<></>);

  useEffect(() => {
    refreshProblem();
  }, []);
  function refreshProblem() {
    setLoading(<Loading/>);
    callGetProblem(1)
      .then((data) => {
        setList(data.data.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.replace("/admin/sign-in");
        } else {
          setToast(
            <Toaster
              message={
                error.response.status !== 0
                  ? error.response.data.message
                    ? error.response.data.message
                    : error.message
                  : error.message
              }
              type="error"
            />
          );
        }
      }).finally(() => {
        setLoading();
      });
  }
  function addProblem() {
    setForm(<Form type={FormType.PROBLEM} closeForm={closeForm}></Form>);
  }
  function updateProblem(id) {
    setForm(
      <Form
        action={AppAction.UPDATE}
        id={id}
        type={FormType.PROBLEM}
        closeForm={closeForm}
      ></Form>
    );
  }
  function showDetail(info) {
    setForm(
      <Form
        type={FormType.PROBLEM_DETAIL}
        info={info}
        closeForm={closeForm}
      ></Form>
    );
  }

  function closeForm() {
    refreshProblem();
    setForm(<></>);
  }
 
  function changeStatus(id) {
    callChangeStatus(id)
      .then(() => {
        setToast(<Toaster message={"Thành công"} type="success" />);
        closeForm();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.replace("/admin/sign-in");
        } else {
          setToast(
            <Toaster
              message={
                error.response.status !== 0
                  ? error.response.data.message
                    ? error.response.data.message
                    : error.message
                  : error.message
              }
              type="error"
            />
          );
        }
      });
  }
  const renderProblem = list
    ? list.map((item, index) => {
        let color = "text-success";
        switch (item.status) {
          case "inactive": {
            color = "text-warning";
            break;
          }
          case "pending": {
            color = "text-secondary";
            break;
          }
          case "decline": {
            color = "text-danger";
            break;
          }
          default:
            break;
        }
        return (
          <tr key={index} className="text-center">
            <td style={{ width: "10%" }}>{item._id}</td>
            <td style={{ width: "20%" }}>{item.problemName}</td>
            <td style={{ width: "20%" }}>{item.problemCode}</td>
            <td style={{ width: "5%" }} class={color}>
              {item.status}
            </td>
            <td
              style={{ width: "5%" }}
            >{item.score}
            </td>
            <td
              style={{ width: "5%" }}
              class={item.level === "easy" ? "text-success" : "text-danger"}
            >
              {item.problemLevel}
            </td>
            <td>
              <span className="btn btn-info" onClick={() => showDetail(item)}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </span>
              <span
                className="btn btn-secondary"
                onClick={() => updateProblem(item._id)}
              >
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <span
                className="btn btn-danger"
                onClick={() => changeStatus(item._id)}
              >
                {item.status === "active" ? (
                  <i className="fa fa-eye-slash" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-eye" aria-hidden="true"></i>
                )}
              </span>
            </td>
          </tr>
        );
      })
    : null;
  return (
    <>
      {toast}
      {form}
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Quản lý bài toán</h4>
            <div className="d-flex justify-content-between">
              <p className="card-description">
                Quản lý bài toán
              </p>
              <button
                onClick={() => addProblem()}
                type="button"
                className="btn btn-primary btn-icon-text"
              >
                <i class="fa-regular fa-plus"></i>
                Thêm bài toán
              </button>
            </div>
            <div className="table-responsive" style={{maxHeight: '560px', overflowY: 'scroll'}}>
              <table className="table table-hover">
                <thead>
                  <tr className="text-center">
                    <th style={{ width: "10%" }}>ID</th>
                    <th style={{ width: "25%" }}>Tên bài</th>
                    <th style={{ width: "10%" }}>Mã bài</th>
                    <th style={{ width: "5%" }}>Trạng thái</th>
                    <th style={{ width: "5%" }}>Số điểm</th>
                    <th style={{ width: "5%" }}>Mức độ</th>
                    <th>Tính năng</th>
                  </tr>
                </thead>
                <tbody>{renderProblem}{loading}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Problem;
