import { useEffect, useRef, useState } from "react";
import {
  callCategoryDetail,
  callCreateCategory,
  callUpdateCategory,
} from "../../../api/category.api";
import { callSingleUpload } from "../../../api/upload.api";
import { AppAction } from "../../../helpers/object.helper";
import { Toaster } from "../../commons/toast";

function CategoryForm(props) {
  const [action, setAction] = useState(AppAction.CREATE);
  const [current, setCurrent] = useState();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Không có file nào được chọn");
  const [toast, setToast] = useState(<></>);
  const [error, setError] = useState({});
  const categoryName = useRef();
  useEffect(() => {
    if (props.action === AppAction.UPDATE) {
      setAction(AppAction.UPDATE);
      callCategoryDetail(props.id)
        .then((data) => {
          categoryName.current.value = data.data.categoryName;
          setCurrent(data.data);
        })
        .catch((error) => {
          props.closeForm();
        });
    }
  }, []);

  function openFileBrowser() {
    const fileElm = document.querySelector(".upload-logo");
    fileElm.click();
  }

  function submitForm(event) {
    event.preventDefault();
    switch (action) {
      case AppAction.CREATE: {
        if (!file) {
          setError(
            JSON.parse(
              JSON.stringify(
                Object.assign(error, { fileError: ` File Can't Be Blank` })
              )
            )
          );
        }
        if (!categoryName.current.value) {
          setError(
            JSON.parse(
              JSON.stringify(
                Object.assign(error, {
                  nameError: ` Category Name Can't Be Blank`,
                })
              )
            )
          );
        }
        if (file && categoryName.current.value) {
          callSingleUpload({ file })
            .then((data) => {
              const logoId = data?.data?.url;
              callCreateCategory({
                categoryName: categoryName.current.value,
                categoryLogo: logoId,
              })
                .then(() => {
                  setToast(
                    <Toaster
                      message={"Create success"}
                      type="success"
                    ></Toaster>
                  );
                  props.closeForm();
                })
                .catch((error) => {
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
                });
            })
            .catch((error) => {
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
            });
        }
        break;
      }
      case AppAction.UPDATE: {
        const id = props.id;
        if (file) {
          callSingleUpload({ file }).then((data) => {
            const logoId = data?.data?.url;
            if (categoryName.current.value !== current.categoryName) {
              callUpdateCategory(id, logoId, categoryName.current.value).then(
                (data) => {
                  setToast(
                    <Toaster message={"update success"} type="success" />
                  );
                  props.closeForm();
                }
              );
            } else {
              callUpdateCategory(id, logoId).then((data) => {
                setToast(<Toaster message={"update success"} type="success" />);
                props.closeForm();
              });
            }
          });
        } else {
          if (categoryName.current.value !== current.categoryName) {
            callUpdateCategory(id, null, categoryName.current.value).then(
              (data) => {
                setToast(<Toaster message={"update success"} type="success" />);
                props.closeForm();
              }
            );
          }
        }
        break;
      }
      default:
        break;
    }
  }
  return (
    <>
      {toast}
      <div className="col-md-8 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div style={{ height: "300px", overflowY: "scroll" }}>
              <h4 className="card-title">{props.title}</h4>
              <p className="card-description">{props.description}</p>
              <form className="forms-sample">
                <div className="form-group">
                  <label Htmlfor="exampleInputName1">
                    Tên danh mục
                    <strong className="text-danger">
                      {error.nameError ? error.nameError : " *"}
                    </strong>
                  </label>
                  <input
                    ref={categoryName}
                    onChange={() => {
                      setError(
                        JSON.parse(
                          JSON.stringify(
                            Object.assign(error, {
                              nameError: ` *`,
                            })
                          )
                        )
                      );
                    }}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                    placeholder="Tên danh mục"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Tải lên ảnh đại diện
                    <strong className="text-danger">
                      {error.fileError ? error.fileError : " *"}
                    </strong>
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="image"
                    onChange={(event) => {
                      setFile(event.target.files[0]);
                      setFileName(event.target.files[0].name);
                      delete error.fileError;
                      setError(JSON.parse(JSON.stringify(error)));
                    }}
                    className="file-upload-default upload-logo"
                  />
                  <div className="input-group col-xs-12">
                    <input
                      type="text"
                      className="form-control file-upload-info"
                      disabled
                      placeholder={fileName}
                    />
                    <span className="input-group-append">
                      <button
                        onClick={() => openFileBrowser()}
                        className="file-upload-browse btn btn-primary"
                        type="button"
                      >
                        Tải lên
                      </button>
                      <button
                        onClick={() => {
                          setFile(null);
                          setFileName("Không có file nào được chọn");
                          const fileElm = document.querySelector("#file");
                          fileElm.value = null;
                        }}
                        className="file-upload-browse btn btn-danger"
                        type="button"
                      >
                        Xóa ảnh
                      </button>
                    </span>
                  </div>
                </div>
                <button
                  onClick={(event) => submitForm(event)}
                  className="btn text-white btn-primary me-2"
                >
                  Thêm
                </button>
                <button className="btn btn-light" onClick={() => props.closeForm()}>
                  Thoát
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryForm;
