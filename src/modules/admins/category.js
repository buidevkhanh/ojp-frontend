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
import { Loading } from "./loading";

function Category() {
  const [form, setForm] = useState(<></>);
  const [toast, setToast] = useState(<></>);
  const [list, setList] = useState();
  const [loading, setLoading] = useState();
  useEffect(() => {
    refreshCategory();
  }, []);
  function refreshCategory() {
    setLoading(<Loading/>)
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
      }).finally(() => {
        setLoading();
      })
  }
  function removeCategory(id) {
    confirmAlert({
      title: "Xóa danh mục",
      message: "Bạn không thể hoàn tác hành động này",
      buttons: [
        {
          label: "Đồng ý",
          onClick: () => {
            callRemoveCategory(id)
              .then(() => {
                setToast(
                  <Toaster message={"Xóa danh mục thành công"} type="success" />
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
          label: "Thoát",
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
          <tr key={index} className="text-center">
            <td style={{ width: "15%" }}>{item._id}</td>
            <td style={{ width: "25%" }}>{item.categoryName}</td>
            <td style={{ width: "5%" }}>
              <img
                className="preview-img"
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
            <td className="text-danger d-flex justify-content-center">
              <div
                className="btn btn-secondary"
                onClick={() => editProblem(item._id)}
              >
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </div>
              <div
                className="btn btn-secondary text-danger"
                onClick={() => removeCategory(item._id)}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </div>
              {item.status === "active" ? (
                <div
                  className="btn btn-secondary text-success"
                  onClick={() => changeStatus(item._id)}
                >
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </div>
              ) : (
                <div
                  className="btn btn-secondary text-dark"
                  onClick={() => changeStatus(item._id)}
                >
                  <i className="fa fa-eye-slash" aria-hidden="true"></i>
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
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Quản lý danh mục</h4>
            <div className="d-flex justify-content-between">
              <p className="card-description">
                Quản lý danh mục
              </p>
              <button
                onClick={() => addProblem()}
                type="button"
                className="btn btn-primary btn-icon-text"
              >
                <i class="fa-regular fa-plus"></i>
                Thêm danh mục
              </button>
            </div>
            <div className="table-responsive" style={{maxHeight: '550px', overflowY: 'scroll'}}>
              <table className="table table-hover">
                <thead>
                  <tr className="text-center">
                    <th style={{ width: "15%" }}>ID</th>
                    <th style={{ width: "25%" }}>Tên danh mục</th>
                    <th style={{ width: "15%" }}>Logo</th>
                    <th style={{ width: "10%" }}>Trạng thái</th>
                    <th style={{ width: "10%" }}>Tạo lúc</th>
                    <th style={{ width: "10%" }}>Cập nhật lúc</th>
                    <th>Tính năng</th>
                  </tr>
                </thead>
                <tbody>{listCategory}{loading}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Category;
