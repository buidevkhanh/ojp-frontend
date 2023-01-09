import { useState, useRef, useEffect } from "react";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import "/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { callGetAllCategory } from "../../../api/category.api";
import { Toaster } from "../../commons/toast";
import {
  callAddTestcase,
  callCreateProblem,
  callDeteletTestcase,
  callProblemDetail,
  callUpdateProblem,
} from "../../../api/problem.api";
import { AppAction } from "../../../helpers/object.helper";
import EditorContainer from "../../commons/texteditor";
import { Loading } from "../loading";

function AddProblem(props) {
  const problemName = useRef();
  const problemLevel = useRef();
  const problemCategory = useRef();
  const [toast, setToast] = useState(<></>);
  const [initialState, setState] = useState();
  const [categories, setList] = useState([]);
  const [editorContent, setContent] = useState();
  const [testcases, setTestcase] = useState([]);
  const [removeList, setRemoveList] = useState([]);
  const [addList, setAddList] = useState([]);
  const inpRequire = useRef();
  const oupRequire = useRef();
  const inp = useRef();
  const oup = useRef();
  const [loading, setLoading] = useState();
  useEffect(() => {
    callGetAllCategory("status=active")
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
    if (props.action === AppAction.UPDATE) {
      setLoading(<Loading/>);
      callProblemDetail(props.id)
        .then((data) => {
          const problem = data.data;
          problemName.current.value = problem.problemName;
          problemLevel.current.value = problem.problemLevel;
          problemCategory.current.value = problem.problemCategory.toString();
          setTestcase([
            ...problem.problemCases.map((item) => {
              return { input: item.input, output: item.output, id: item._id };
            }),
          ]);
          inpRequire.current.value = problem.expectedInput;
          oupRequire.current.value = problem.expectedOutput;
          const blocksFromHtml = htmlToDraft(problem.problemQuestion);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          setState(EditorState.createWithContent(contentState));
        })
        .catch((error) => {

          if (error?.response?.status === 401) {
            window.location.replace("/admin/sign-in");
          } else {
            setToast(
              <Toaster
                message={
                  error?.response?.status !== 0
                    ? error?.response?.data.message
                      ? error?.response?.data.message
                      : error?.message
                    : error?.message
                }
                type="error"
              />
            );
          }
        }).finally(() => {
          setLoading();
        });
    }
  }, []);
  function addTestCase() {
    if (!inp.current.value && !oup.current.value) {
      setToast(
        <Toaster
          message={"Testcase's input and output can't be blank"}
          type="error"
        />
      );
    } else {
      setAddList([
        ...addList,
        { input: inp.current.value, output: oup.current.value },
      ]);
      setTestcase([
        ...testcases,
        { input: inp.current.value, output: oup.current.value },
      ]);
    }
  }
  function removeTestcase(index, id) {
    const newList = testcases;
    newList.splice(index, 1);
    setTestcase([...newList]);
    if (id) {
      setRemoveList([...removeList, id]);
    }
  }
  const options = categories
    ? categories.map((item, index) => {
        return (
          <option value={item._id} key={index}>
            {item.categoryName}
          </option>
        );
      })
    : null;
  function addProblem(id) {
    const name = problemName.current.value;
    const level = problemLevel.current.value;
    const category = problemCategory.current.value;
    const content = editorContent;
    const expectedInput = inpRequire.current.value;
    const expectedOutput = oupRequire.current.value;
    const cases = testcases;
    if(cases.length === 0) {
      setToast(
        <Toaster message={"Testcase rỗng"} type="error" />
      );
      return;
    }
    if (props.action === AppAction.UPDATE) {
      const update = {
        problemName: name,
        problemLevel: level,
        problemCategory: category,
        problemQuestion: content,
        expectedInput,
        expectedOutput,
      };
      const updateField = {};
      for (const key in update) {
        if (update[key]) {
          Object.assign(updateField, { [key]: update[key] });
        }
      }
      callUpdateProblem(props.id, updateField).then(() => {
        callDeteletTestcase(removeList)
          .then(() => {
            callAddTestcase(props.id, addList)
              .then(() => {
                props.closeForm();
              })
              .catch((error) => {
                console.log("Thêm testcase thất bại");
              });
          })
          .catch((error) => {
            console.log("Xóa testcase thất bại");
          });
      });
    } else {
      callCreateProblem({
        problemName: name,
        problemLevel: level,
        problemCategory: category,
        problemQuestion: content,
        expectedInput,
        expectedOutput,
        problemCases: cases,
      })
        .then(() => {
          setToast(
            <Toaster message={"Tạo thành công"} type="success" />
          );
          setTimeout(() => {
            props.closeForm();
          }, 2000);
        })
        .catch((error) => {});
    }
  }
  function handleChange(text) {
    setContent(text);
  }
  const renderTestcase = testcases
    ? testcases.map((item, index) => {
        return (
          <li className="testcase-preview mb-1" key={index}>
            <span className="d-flex justify-content-between align-items-center">
              <span className="px-2">testcase #{index + 1}</span>
              <span
                className="btn btn-danger m-0 my-2"
                onClick={() => removeTestcase(index, item?.id)}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </span>
            </span>
            <span className="preview px-2 bg-white border d-flex justify-content-center align-items-center">
              <pre className="w-50">{item.input}</pre>
              <pre className="w-50">{item.output}</pre>
            </span>
          </li>
        );
      })
    : null;
  return (
    <>
      {loading}
      {toast}
      <div className="col-md-8 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div style={{ height: "800px", overflowY: "scroll" }}>
              <h4 className="card-title">{props.title}</h4>
              <p className="card-description">{props.description}</p>
              <form className="forms-sample">
                <div className="form-group">
                  <label for="exampleInputName">Tên bài toán</label>
                  <input
                    ref={problemName}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                    placeholder="Problem Name"
                  />
                </div>
                <div className="form-group">
                  <label for="exampleInputPassword4">Chọn mức độ</label>
                  <select
                    ref={problemLevel}
                    className="form-control"
                    defaultValue={"easy"}
                    id="exampleSelectGender"
                  >
                    <option value={"easy"}>Dễ</option>
                    <option value={"medium"}>Trung bình</option>
                  </select>
                </div>
                <div className="form-group">
                  <label for="exampleSelectGender">Chọn danh mục</label>
                  <select
                    ref={problemCategory}
                    className="form-control"
                    id="exampleSelectGender"
                  >
                    {options}
                  </select>
                </div>
                <div className="form-group">
                  <label for="exampleSelectGender">Soạn thảo câu hỏi</label>
                  <div>
                    <EditorContainer
                      id={props.id}
                      action={props.action}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="form-group w-50 mr-1 mb-2">
                    <label for="exampleTextarea1">Ràng buộc đầu vào</label>
                    <textarea
                      ref={inpRequire}
                      style={{ lineHeight: "25px" }}
                      className="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="form-group w-50 ml-1 mb-2">
                    <label for="exampleTextarea1">Ràng buộc đầu ra</label>
                    <textarea
                      ref={oupRequire}
                      style={{ lineHeight: "25px" }}
                      className="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="form-group w-50 mr-1 mb-2">
                    <label for="exampleTextarea1">Đầu vào testcase</label>
                    <textarea
                      ref={inp}
                      style={{ lineHeight: "25px" }}
                      className="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="form-group w-50 ml-1 mb-2">
                    <label for="exampleTextarea1">Đầu ra testcase</label>
                    <textarea
                      ref={oup}
                      style={{ lineHeight: "25px" }}
                      className="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className="text-end">
                  <span
                    onClick={() => addTestCase()}
                    type="submit"
                    className="btn text-white btn-success mr-0"
                  >
                    Thêm testcase
                  </span>
                </div>
                <div className="testcase">
                  <ul style={{ listStyle: "none", padding: "0" }}>
                    {renderTestcase}
                  </ul>
                </div>
                <span
                  onClick={() => addProblem()}
                  type="submit"
                  className="btn text-white btn-primary me-2"
                >
                  Thêm
                </span>
                <span className="btn btn-light" onClick={() => props.closeForm()}>
                  Thoát
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddProblem;
