import { useState, useRef, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
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

function AddProblem(props) {
  const problemName = useRef();
  const problemLevel = useRef();
  const problemCategory = useRef();
  const problemScope = useRef();
  const [toast, setToast] = useState(<></>);
  const [categories, setList] = useState([]);
  const [testcases, setTestcase] = useState([]);
  const [removeList, setRemoveList] = useState([]);
  const [addList, setAddList] = useState([]);
  const inpRequire = useRef();
  const oupRequire = useRef();
  const inp = useRef();
  const oup = useRef();
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
      callProblemDetail(props.id)
        .then((data) => {
          const problem = data.data;
          problemName.current.value = problem.problemName;
          problemLevel.current.value = problem.problemLevel;
          problemScope.current.value = problem.problemScope;
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
          setEditorState(EditorState.createWithContent(contentState));
        })
        .catch((error) => {
          console.log(error);
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
        });
    }
  }, []);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  function onEditorStateChange(state) {
    setEditorState(state);
  }
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
    const scope = "public";
    const content = draftToHtml(editorState);
    const expectedInput = inpRequire.current.value;
    const expectedOutput = oupRequire.current.value;
    const cases = testcases;
    if (props.action === AppAction.UPDATE) {
      const update = {
        problemName: name,
        problemLevel: level,
        problemCategory: category,
        problemScope: scope,
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
                console.log("add testcase error");
              });
          })
          .catch((error) => {
            console.log("remove testcase error");
          });
      });
    } else {
      callCreateProblem({
        problemName: name,
        problemLevel: level,
        problemCategory: category,
        problemScope: scope,
        problemQuestion: content,
        expectedInput,
        expectedOutput,
        problemCases: cases,
      })
        .then(() => {
          setToast(
            <Toaster message={"Create problem success"} type="success" />
          );
          props.closeForm();
        })
        .catch((error) => {});
    }
  }
  const renderTestcase = testcases
    ? testcases.map((item, index) => {
        return (
          <li class="testcase-preview mb-1" key={index}>
            <span class="d-flex justify-content-between align-items-center">
              <span class="px-2">testcase #{index + 1}</span>
              <span
                class="btn btn-danger m-0 my-2"
                onClick={() => removeTestcase(index, item?.id)}
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </span>
            </span>
            <span class="preview px-2 bg-white border d-flex justify-content-center align-items-center">
              <pre class="w-50">{item.input}</pre>
              <pre class="w-50">{item.output}</pre>
            </span>
          </li>
        );
      })
    : null;
  return (
    <>
      {toast}
      <div class="col-md-8 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div style={{ height: "800px", overflowY: "scroll" }}>
              <h4 class="card-title">{props.title}</h4>
              <p class="card-description">{props.description}</p>
              <form class="forms-sample">
                <div class="form-group">
                  <label for="exampleInputName1">Input Name</label>
                  <input
                    ref={problemName}
                    type="text"
                    class="form-control"
                    id="exampleInputName1"
                    placeholder="Problem Name"
                  />
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword4">Select Level</label>
                  <select
                    ref={problemLevel}
                    class="form-control"
                    defaultValue={"easy"}
                    id="exampleSelectGender"
                  >
                    <option value={"easy"}>Easy</option>
                    <option value={"medium"}>Medium</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleSelectGender">Select Scope</label>
                  <select
                    ref={problemScope}
                    class="form-control"
                    defaultValue={"Public"}
                    id="exampleSelectGender"
                  >
                    <option value="public">Public</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleSelectGender">Select Category</label>
                  <select
                    ref={problemCategory}
                    class="form-control"
                    defaultValue={"Public"}
                    id="exampleSelectGender"
                  >
                    {options}
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleSelectGender">Input Question</label>
                  <div class="border" style={{ height: "300px" }}>
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={onEditorStateChange}
                    ></Editor>
                  </div>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <div class="form-group w-50 mr-1 mb-2">
                    <label for="exampleTextarea1">Input require</label>
                    <textarea
                      ref={inpRequire}
                      style={{ lineHeight: "25px" }}
                      class="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group w-50 ml-1 mb-2">
                    <label for="exampleTextarea1">Output require</label>
                    <textarea
                      ref={oupRequire}
                      style={{ lineHeight: "25px" }}
                      class="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <div class="form-group w-50 mr-1 mb-2">
                    <label for="exampleTextarea1">Input testcase</label>
                    <textarea
                      ref={inp}
                      style={{ lineHeight: "25px" }}
                      class="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="form-group w-50 ml-1 mb-2">
                    <label for="exampleTextarea1">Expected output</label>
                    <textarea
                      ref={oup}
                      style={{ lineHeight: "25px" }}
                      class="form-control mb-0"
                      id="exampleTextarea1"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div class="text-end">
                  <span
                    onClick={() => addTestCase()}
                    type="submit"
                    class="btn text-white btn-success mr-0"
                  >
                    Add testcase
                  </span>
                </div>
                <div class="testcase">
                  <ul style={{ listStyle: "none", padding: "0" }}>
                    {renderTestcase}
                  </ul>
                </div>
                <span
                  onClick={() => addProblem()}
                  type="submit"
                  class="btn text-white btn-primary me-2"
                >
                  Submit
                </span>
                <span class="btn btn-light" onClick={() => props.closeForm()}>
                  Cancel
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
