import { useEffect, useState } from "react";
import {
  callChangeCategory,
  callGetCategory,
  callRemoveCategory,
} from "../../api/category.api";
import { AppAction, FormType } from "../../helpers/object.helper";
import { Toaster } from "../commons/toast";
import Form from "./form";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

function Category() {
  const [form, setForm] = useState(<></>);
  const [toast, setToast] = useState(<></>);
  const [list, setList] = useState();
  useEffect(() => {
    refreshCategory();
  }, []);
  function refreshCategory() {
    callGetCategory(1)
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
  function removeCategory(id) {
    confirmAlert({
      title: "Remove a category",
      message: "Are you sure to do this ! This action can't be undo",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            callRemoveCategory(id)
              .then(() => {
                setToast(
                  <Toaster message={"remove category success"} type="success" />
                );
                refreshCategory();
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
          },
        },
        {
          label: "No",
        },
      ],
    });
  }
  function addProblem() {
    setForm(
      <Form
        type={FormType.CATEGORY}
        refres={refreshCategory}
        closeForm={closeForm}
      ></Form>
    );
  }
  function editProblem(id) {
    setForm(
      <Form
        id={id}
        action={AppAction.UPDATE}
        type={FormType.CATEGORY}
        refres={refreshCategory}
        closeForm={closeForm}
      ></Form>
    );
  }
  function closeForm() {
    setForm(<></>);
    refreshCategory();
  }
  function changeStatus(id) {
    callChangeCategory(id).then(() => {
      refreshCategory();
    });
  }
  const listCategory = list
    ? list.map((item, index) => {
        return (
          <tr key={index} class="text-center">
            <td style={{ width: "15%" }}>{item._id}</td>
            <td style={{ width: "25%" }}>{item.categoryName}</td>
            <td style={{ width: "5%" }}>
              <img
                class="preview-img"
                src={item.categoryLogo}
                alt={"preview-category"}
              ></img>
            </td>
            <td
              style={{ width: "12%" }}
              class={
                item.status === "active"
                  ? "text-success bold"
                  : "bold text-danger"
              }
            >
              {item.status}
            </td>
            <td style={{ width: "12%" }}>{item.createdAt}</td>
            <td style={{ width: "12%" }}>{item.updatedAt}</td>
            <td class="text-danger d-flex justify-content-center">
              <div
                class="btn btn-secondary"
                onClick={() => editProblem(item._id)}
              >
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </div>
              <div
                class="btn btn-secondary text-danger"
                onClick={() => removeCategory(item._id)}
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </div>
              {item.status === "active" ? (
                <div
                  class="btn btn-secondary text-success"
                  onClick={() => changeStatus(item._id)}
                >
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </div>
              ) : (
                <div
                  class="btn btn-secondary text-dark"
                  onClick={() => changeStatus(item._id)}
                >
                  <i class="fa fa-eye-slash" aria-hidden="true"></i>
                </div>
              )}
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
            <h4 class="card-title">Manage categories</h4>
            <div class="d-flex justify-content-between">
              <p class="card-description">
                Manage categories witch showing in main's student page
              </p>
              <button
                onClick={() => addProblem()}
                type="button"
                class="btn btn-primary btn-icon-text"
              >
                <i class="ti-plus btn-icon-prepend"></i>
                Add Category
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr class="text-center">
                    <th style={{ width: "15%" }}>ID</th>
                    <th style={{ width: "25%" }}>Name</th>
                    <th style={{ width: "15%" }}>Logo</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "10%" }}>Created Time</th>
                    <th style={{ width: "10%" }}>Updated Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{listCategory}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Category;
