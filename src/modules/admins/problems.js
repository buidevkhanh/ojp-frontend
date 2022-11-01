import { useEffect, useState } from "react";
import { callChangeStatus, callGetProblem } from "../../api/problem.api";
import { AppAction, FormType } from "../../helpers/object.helper";
import { Toaster } from "../commons/toast";
import Form from "./form";

function Problem() {
  const [form, setForm] = useState(<></>);
  const [list, setList] = useState([]);
  const [toast, setToast] = useState(<></>);

  useEffect(() => {
    refreshProblem();
  }, []);
  function refreshProblem() {
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
        setToast(<Toaster message={"change success"} type="success" />);
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
          <tr key={index} class="text-center">
            <td style={{ width: "10%" }}>{item._id}</td>
            <td style={{ width: "20%" }}>{item.problemName}</td>
            <td style={{ width: "20%" }}>{item.problemCode}</td>
            <td style={{ width: "5%" }} class={color}>
              {item.status}
            </td>
            <td style={{ width: "5%" }}>{item.problemScope}</td>
            <td
              style={{ width: "5%" }}
              class={item.level === "easy" ? "text-success" : "text-danger"}
            >
              {item.problemLevel}
            </td>
            <td style={{ width: "10%" }}>{item.class || "N/A"}</td>
            <td>
              <span class="btn btn-info" onClick={() => showDetail(item)}>
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </span>
              <span
                class="btn btn-secondary"
                onClick={() => updateProblem(item._id)}
              >
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <span
                class="btn btn-danger"
                onClick={() => changeStatus(item._id)}
              >
                {item.status === "active" ? (
                  <i class="fa fa-eye-slash" aria-hidden="true"></i>
                ) : (
                  <i class="fa fa-eye" aria-hidden="true"></i>
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
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Manage problems</h4>
            <div class="d-flex justify-content-between">
              <p class="card-description">
                Manage problems witch showing in main's student page
              </p>
              <button
                onClick={() => addProblem()}
                type="button"
                class="btn btn-primary btn-icon-text"
              >
                <i class="ti-plus btn-icon-prepend"></i>
                Add problem
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="text-center">
                    <th style={{ width: "10%" }}>ID</th>
                    <th style={{ width: "25%" }}>Name</th>
                    <th style={{ width: "10%" }}>Code</th>
                    <th style={{ width: "5%" }}>Status</th>
                    <th style={{ width: "5%" }}>Scope</th>
                    <th style={{ width: "5%" }}>Level</th>
                    <th style={{ width: "20%" }}>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{renderProblem}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Problem;
