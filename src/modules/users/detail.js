import { useEffect, useState } from "react";
import { callGetDetail } from "../../api/problem.api";
import { getCookie, setCookie } from "../../helpers/cookie.helper";
import CodeEditor from "../commons/editor";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import { Toaster } from "../commons/toast";
import UserRunner from "./runner";
import io from 'socket.io-client';
import { SERVER_HOST } from "../../configs/app.config";
import { AppObject } from "../../configs/app.object";
import { useSearchParams } from "react-router-dom";
import { callDetailSubmit } from "../../api/submission.api";

const socket = io(SERVER_HOST);


export default function ProblemDetail() {
  const [problem, setProblem] = useState();
  const [code, setCode] = useState();
  const [language, setLanguage] = useState('java');
  const [toast, setToast] = useState(<></>);
  const [token, setToken] = useState();
  const [showRun, setShowRun] = useState(false);
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const isEdit = params.get('edit');
    if(isEdit) {
      callDetailSubmit(isEdit).then((data) => {
        setCode(data.data.userCode);  
        setLanguage(data.data.language || 'cpp');
        const path = window.location.pathname;
        const code = path.split("/").at(-1);
        setToken(getCookie('_token'));
        callGetDetail(code)
          .then((data) => {
            setProblem(data.data);
          })
          .catch((error) => {
            setToast(<Toaster message={"problemNotFound"} type="error" />);
          });
      })
    } else {
      const path = window.location.pathname;
      const code = path.split("/").at(-1);
      setToken(getCookie('_token'));
      callGetDetail(code)
        .then((data) => {
          setProblem(data.data);
        })
        .catch((error) => {
          setToast(<Toaster message={"problemNotFound"} type="error" />);
        });
    }
  }, []);

  function submitCode() {
    socket.emit(AppObject.SOCKET_ACTIONS.ACTION_SUBMIT_PROBLEM, {
      code: code,
      language: language,
      token: token,
      problem: problem
    });
   window.location.assign("/history?auth=me");
  }

  return (
    <>
      {toast}
      <NavigationBar />
      { showRun ? <UserRunner problem={problem._id} token={token} hideRun={() => setShowRun(false)} code={code} language={language}/> : null}
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
                <p class="m-0 text-danger">{ token ? null : " * To submit code, you need login !"}</p>
                <div class="action text-end">
                  <div class="btn btn-success" onClick={() => setShowRun(true)}>
                    {" "}
                    <i class="fa fa-cogs mx-2" aria-hidden="true"></i>Run code
                  </div>
                  { token ?
                  <div class="btn btn-primary ml-2" onClick={() => submitCode()}>
                    {" "}
                    <i class="fa fa-upload mx-2" aria-hidden="true"></i>Submit
                  </div>
                  : null }
                </div>
                <CodeEditor default={code} defaultLanguage={language} changeCode={setCode} changeLanguage={setLanguage} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
