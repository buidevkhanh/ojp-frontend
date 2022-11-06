import { useEffect, useState } from "react";
import { callGetDetail } from "../../api/problem.api";
import CodeEditor from "../commons/editor";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import { Toaster } from "../commons/toast";

export default function ProblemDetail() {
  const [problem, setProblem] = useState();
  const [toast, setToast] = useState(<></>);
  useEffect(() => {
    const path = window.location.pathname;
    const code = path.split("/").at(-1);
    callGetDetail(code)
      .then((data) => {
        setProblem(data.data);
      })
      .catch((error) => {
        setToast(<Toaster message={"problemNotFound"} type="error" />);
      });
  }, []);
  return (
    <>
      {toast}
      <NavigationBar />
      <div class="container py-3">
        {!problem ? (
          <div class="text-center py-3">
            <h1 class="text-primary large-text" style={{ fontWeight: "bold" }}>
              404
            </h1>
            <p class="text-secondary">
              Sorry ! unable find your requested resource, error code: 404
            </p>
          </div>
        ) : (
          <div class="py-3">
            <h4>
              {problem.problemName} - {problem.problemCode}
            </h4>
            {problem.problemLevel === "easy" ? (
              <p class="badge badge-opacity-success">Easy</p>
            ) : (
              <p class="badge badge-opacity-warning">Medium</p>
            )}
            <div class="row">
              <div class="col-md-6 border">
                <div
                  class="py-3 px-2"
                  dangerouslySetInnerHTML={{ __html: problem.problemQuestion }}
                ></div>
              </div>
              <div class="col-md-6 border">
                <div class="py-3 px-2">
                  <h5>Input</h5>
                  <p>
                    {problem.expectedInput
                      ? problem.expectedInput
                      : "No input expected"}
                  </p>
                  <h5>Output</h5>
                  <p>
                    {problem.expectedOutput
                      ? problem.expectedOutput
                      : "No output expected"}
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 py-3 border">
                <h5>Example</h5>
                <h6>Input: </h6>
                <p>{problem.example.input}</p>
                <h6>Output: </h6>
                <p>{problem.example.output}</p>
              </div>
            </div>
            <div class="row">
              <div class="editor-code">
                <h4 class="my-4 p-0 mx-0">Online code editor</h4>
                <div class="action text-end">
                  <div class="btn btn-success">
                    {" "}
                    <i class="fa fa-cogs mx-2" aria-hidden="true"></i>Run code
                  </div>
                  <div class="btn btn-primary ml-2">
                    {" "}
                    <i class="fa fa-upload mx-2" aria-hidden="true"></i>Submit
                  </div>
                </div>
                <CodeEditor />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
