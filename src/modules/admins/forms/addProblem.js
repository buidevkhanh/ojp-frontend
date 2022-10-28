import { useState, useRef } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function AddProblem(props) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  function onEditorStateChange(editorState) {
    setEditorState(editorState);
    console.log(draftToHtml(editorState));
  }
  return (
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
                  type="text"
                  class="form-control"
                  id="exampleInputName1"
                  placeholder="Problem Name"
                />
              </div>
              <div class="form-group">
                <label for="exampleInputPassword4">Select Level</label>
                <select
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
                  class="form-control"
                  defaultValue={"Public"}
                  id="exampleSelectGender"
                >
                  <option value="public">Public</option>
                  <option value="protect">Protected</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div class="form-group">
                <label for="exampleSelectGender">Input Question</label>
                <div class="border" style={{ height: "300px" }}>
                  <Editor onContentStateChange={onEditorStateChange}></Editor>
                </div>
              </div>
              <div class="d-flex justify-content-center align-items-center">
                <div class="form-group w-50 mr-1 mb-2">
                  <label for="exampleTextarea1">Input require</label>
                  <textarea
                    style={{ lineHeight: "25px" }}
                    class="form-control mb-0"
                    id="exampleTextarea1"
                    rows="4"
                  ></textarea>
                </div>
                <div class="form-group w-50 ml-1 mb-2">
                  <label for="exampleTextarea1">Output require</label>
                  <textarea
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
                    style={{ lineHeight: "25px" }}
                    class="form-control mb-0"
                    id="exampleTextarea1"
                    rows="4"
                  ></textarea>
                </div>
                <div class="form-group w-50 ml-1 mb-2">
                  <label for="exampleTextarea1">Expected output</label>
                  <textarea
                    style={{ lineHeight: "25px" }}
                    class="form-control mb-0"
                    id="exampleTextarea1"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div class="text-end">
                <button type="submit" class="btn text-white btn-success mr-0">
                  Add testcase
                </button>
              </div>
              <div class="testcase">
                <ul style={{ listStyle: "none", padding: "0" }}>
                  <li class="testcase-preview">
                    <span class="d-flex justify-content-between align-items-center">
                      <span class="px-2">Testcase 01</span>
                      <span class="btn btn-danger m-0 my-2">
                        Remove this testcase
                      </span>
                    </span>
                    <span class="preview px-2 bg-white border d-flex justify-content-center align-items-center">
                      <pre class="w-50">Input: 0 5 5 6 6 6</pre>
                      <pre class="w-50">Output: 0 5 5 6 6 6</pre>
                    </span>
                  </li>
                </ul>
              </div>
              <button type="submit" class="btn text-white btn-primary me-2">
                Submit
              </button>
              <button class="btn btn-light" onClick={() => props.closeForm()}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddProblem;
