import { useEffect, useRef, useState } from "react"
import { AppObject } from "../../configs/app.object";
import { Toaster } from "../commons/toast";
import io from 'socket.io-client';
import { SOCKET_HOST } from "../../configs/app.config";

const socket = io(SOCKET_HOST);

export default function UserRunner(props) {
    const input = useRef();
    const [output, setOutput] = useState();
    const [running, setRunning] = useState();
    const [complied, setCompiled] = useState();
    const [toast, setToast] = useState(<></>);

    socket.on(AppObject.SOCKET_ACTIONS.RESPONSE_RUNCODE, (data) => {
      if(!data.isCompile) {
        const errorArray = data.error.split('\n');
        errorArray[0] = errorArray[0].trim();
        let dataOutput = errorArray.map((item, index) => {
          return <pre key={index} className="m-0 p-0 text-white">{item}</pre>
        })
        dataOutput.unshift(<p className="m-0 p-0 text-danger">Compile error : </p>)
        setOutput(dataOutput);
        setRunning(false);
      } else {
        setCompiled('Compiled success, testing ...');
      }
    })

    socket.on(AppObject.SOCKET_ACTIONS.OUTPUT_RUNCODE, (data) => {
      if(data.output) {
        const outputArray = data.output.split('\n');
        let dataOutput = outputArray.map((item, index) => {
          return <pre key={index} className="m-0 p-0 text-white">{item}</pre>
        })
        dataOutput.unshift(<p className="m-0 w-100 p-0 text-success">{`Run code success (executeTime: ${data.time}s)`}</p>)
        setOutput(dataOutput);
      } else if (data.error) {
        setOutput(<p className="m-0  w-100 p-0 text-danger">{`Error: ${data.error} (executeTime: ${data.time}s)`}</p>)
      }
      setRunning(false);
      setCompiled('Run this test');
    })

    useEffect(() => {
    }, []);

    function runCode() {
        setOutput('Wating for output...');
        if(!props.code || !props.code.trim()) {
          setToast(<Toaster message="Mã nguồn không thể để trống" type="warning"/>)
        } else {
          setRunning(true);
          setCompiled('Compiling ...');
          socket.emit(AppObject.SOCKET_ACTIONS.ACTION_RUNCODE, {
            code: props.code,
            language: props.language,
            token: props.token,
            input: input.current.value || "",
            problem: props.problem
          });
        }
      }
    function handleClose() {
        input.current.value = "";
        setOutput(null);
        props.hideRun();
    }
    return (
        <div className="position-fixed d-flex justify-content-center align-items-center top-0 left-0 w-100" style={{backgroundColor: 'rgba(0,0,0,0.65)', height: '100vh', zIndex: 1000}}>
            {toast}
            <div style={{height: '420px', maxHeight: '420px', width: '35%', backgroundColor: 'white'}}>
                <div className="form-group position-relative w-100 text-right mr-1 mb-2 px-4 py-4">
                    <div style={{position: 'absolute', right: '10px', top: '10px'}} onClick={() => handleClose()}>
                    <i className="fas text-danger fa-times-circle" style={{fontSize: '25px'}} aria-hidden="true"></i>
                    </div>
                    <div className="text-left"><p>Input Test:</p></div>
                    <textarea
                      ref={input}
                      style={{ lineHeight: "20px" }}
                      className="form-control mb-0"
                      rows="4"
                    ></textarea>
                    { running ? 
                    (<div className="btn btn-success w-100 d-flex justify-content-center align-items-center my-3">
                      <div className="spinner-border mx-2" style={{width: '20px', height: '20px', borderWidth: '2px'}} role="status">
                        <span className="sr-only" >Loading...</span>
                      </div>
                      <span style={{fontSize: '12px'}}>{complied}</span>
                    </div>) :
                    <div className="btn btn-success my-3 w-100" onClick={() => runCode()}>Run this test</div>
                    }
                    <div className="text-left"><p>Ouput result:</p></div>
                    <div className="w-100 text-left form-control mb-0 text-white bg-dark p-1" style={{height: "120px", overflowY: 'scroll'}}>
                        <p className="text-white text-left m-0 p-0">{output || 'No output received'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}