import { useEffect, useState } from "react";
import { userGetContestHistory, userGetDetailContest } from "../../api/contest.api";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import socket from '../../helpers/sockets/index';
import { getCookie } from '../../helpers/cookie.helper';
import { AppObject } from "../../configs/app.object";
import { Toaster } from '../commons/toast';

export default function ContestOrganize() {
    const [detail, setDetail] = useState();
    const [show, setShow] = useState([]);
    const [isDone, setDone] = useState(false);
    const [point, setPoint] = useState([]);
    const [files, setFiles] = useState([]);
    const [toast, setToast] = useState(<></>);
    const [history, setHistory] = useState([]);

    const token = getCookie("_token");

    useEffect(() => {
        const path = window.location.pathname;
        const contestId = path.split('/').at(-1);
        if(!contestId.match(new RegExp('^[a-f0-9]{24,24}$'))) {
           window.location.replace('/home');
        }
        userGetDetailContest(contestId).then((data) => {
            setDetail(data.data);
            const newFiles = [];
            for(let i = 0; i < data.data.questions.length; i++) {
                newFiles.push(null);
            }
            const questions = data.data.questions;
            setFiles(newFiles);
            const initShow = [];
            for(let i = 0; i < data.data.questions.length; i++) {
                initShow.push(false);
                history.push({ problem: data.data.questions[i].problem._id, history: []});
                show.push(false);
                point.push(0);
            }
            setPoint([...point]);
            setHistory([...history]);
            setShow(initShow);
            socket.emit(AppObject.SOCKET_ACTIONS.JOIN_CONTEST, { contestId, token });
            userGetContestHistory(contestId).then((data) => {
                const histories = data.data.history;
                if(data.data.status === 'done') {
                    setDone(true);
                }
                const status = data.data.status;
                if(status === 'done') {
                    setDone(true);
                }
                for(let i = 0; i < histories.length; i++) {
                    const indexFound = history.findIndex((item) => {
                        return item.problem === histories[i].problem;
                    })
                    if(indexFound > -1) {
                        history[indexFound].history.push(histories[i]);
                        if(histories[i].status === 'Accepted' && point[indexFound] === 0) {
                            point[indexFound].push(questions[i].point);
                        }
                    }
                }
                console.log(point);
                setPoint([...point]);
                setHistory([...history]);
            })
        })
    },[])

    socket.on('')

    socket.on(AppObject.SOCKET_ACTIONS.HOOK_SUBMISSION, () => {
        if(isDone) return;
        const path = window.location.pathname;
        const contestId = path.split('/').at(-1);
        if(!contestId.match(new RegExp('^[a-f0-9]{24,24}$'))) {
           window.location.replace('/home');
        }
        const newHistory = structuredClone(history);
        for(let i = 0; i < newHistory.length; i++) {
            newHistory[i].history = [];
        }
        userGetContestHistory(contestId).then((data) => {
            const histories = data.data.history;

            for(let i = 0; i < histories.length; i++) {
                const indexFound = newHistory.findIndex((item) => {
                    return item.problem === histories[i].problem;
                })
                if(indexFound > -1) {
                    newHistory[indexFound].history.push(histories[i]);
                }
            }
            setHistory([...newHistory]);
        })
    })

    function filesChange(e, index) {
        if(isDone) return;
        const file = e.target.files[0];
        const newFiles = [];
        for(let i = 0; i < index; i++) {
            newFiles.push(files[i]);
        }
        newFiles.push(file);
        for(let i = index + 1; i < files.length; i++) {
            newFiles.push(files[i]);
        }
        setFiles([...newFiles]);
    }

    function handleSubmit(i, item) {
        if(isDone) return;
        const nameParts = files[i].name.split(".");
        let language = "";
        if(nameParts.length >= 2) {
            switch(nameParts.at(-1)){
                case "cpp": {
                    language = "cpp";
                    break;
                }
                case "java": {
                    language = "java";
                    break;
                }
                default: break;
            }
        }
        if(!language) {
            setToast(<Toaster message={"Unsupported file"} type="error"/>);
            return;
        }
        if(!item.problem) {
            setToast(<Toaster message={"Problem error"} type="error"/>);
            return;
        }
        socket.emit(AppObject.SOCKET_ACTIONS.SUBMIT_CONTEST, 
        {
            file: files[i],
            token: token,
            language: language,
            problem: item.problem,
            contest: detail._id,
        });
    }

    function finishContest() {
        socket.emit('finish', {
            token: token,
            contest: detail._id
        });
    }

    const questionDetail = [];
    if(detail?.questions) {
        for(let i = 0; i < detail.questions.length; i++) {
            const item = detail.questions[i];
            questionDetail.push(
                <div key={i} class="question px-2 py-2">
                        <h4 class="m-0">
                            <strong>Question {i + 1}: {item.problem.problemName} </strong>
                            <p class="badge badge-opacity-success">{item.score} point</p>
                        </h4>
                        <div class="content px-2 py-2" style={{border: '1px solid #e3e3e3'}}>
                            <div dangerouslySetInnerHTML={{ __html: item.problem.problemQuestion }}></div>
                            <h5>Input contrains</h5>
                            <p>{item.problem.expectedInput || 'No input contrains'}</p>
                            <h5>Output expected</h5>
                            <p>{item.problem.expectedOutput || 'No output contrains'}</p>
                            <h5>Example</h5>    
                            <p class="m-0">Input</p>
                            <pre>{item.problem.example.input}</pre>
                            <p class="m-0">Output</p>
                            <pre>{item.problem.example.output}</pre>
                            <div class="submit-form text-right">
                                <label htmlFor={`index${i}`} class="w-75" style={{fontSize: '14px'}}>
                                    <span class="d-inline-block text-left" style={{padding: '5px 20px', width: '89%', border: '1px solid #e3e3e3', color: 'black'}}>{isDone ? 'Blocked upload because contest ended': files[i]?.name || "No file choosen"}</span>
                                </label>
                                { !isDone ?
                                <span class="d-inline-block text-center cursor" style={{ padding: '5px 0px', width: '9%', background: '#34b1aa', border: '1px solid #34b1aa', color: 'white', fontSize: '14px'}}
                                onClick={() => handleSubmit(i, item)}>Submit</span>
                                : 
                                <span class="d-inline-block text-center cursor" style={{ padding: '5px 0px', width: '9%', background: '#e3e3e3', border: '3px solid #e3e3e3e', color: 'white', fontSize: '14px'}}>Ended</span>
                                }
                                { 
                                !isDone ?
                                <input type="file" accept=".cpp,.java,.py" onChange={(e) => filesChange(e, i)} id={`index${i}`} style={{display: 'none'}}></input>
                                : null
                                }
                            </div>
                            <div class="history">
                                <h5 class="text-secondary">
                                    Submit history
                                    { !show[i] ?
                                    <i class="fa fa-caret-down mx-2" onClick={() => {show[i] = !show[i]; setShow([...show])}} aria-hidden="true"></i>
                                    :
                                    <i class="fa fa-caret-up mx-2" onClick={() => {show[i] = !show[i]; setShow([...show])}} aria-hidden="true"></i>
                                    }
                                </h5>
                                { show[i] ?
                                <ul class="m-0 p-0 border" style={{listStyle: 'none'}}>
                                    <li class="submission d-flex w-100 py-3 justify-content-center align-items-center" style={{background: '#f5f6f4'}}>
                                        <div style={{width: '25%'}} class="text-center">Submission ID</div>
                                        <div style={{width: '45%'}} class="text-center">Timestamp</div>
                                        <div style={{width: '10%'}} class="text-center">Execute</div>
                                        <div style={{width: '20%'}} class="text-center">Result</div>
                                    </li>
                                    {
                                        history[i].history.map((item, index) => {
                                            return (
                                                <li key={index} class="submission d-flex w-100 py-3 justify-content-center align-items-center">
                                                    <div style={{width: '25%'}} class="text-center">{item._id}</div>
                                                    <div style={{width: '45%'}} class="text-center">{item.createdAt}</div>
                                                    <div style={{width: '10%'}} class="text-center">{item.executeTime}</div>
                                                    { item.status === 'Accepted' ?
                                                        <div style={{width: '20%'}} class="text-center text-success">{item.status}</div>
                                                    : 
                                                      item.status === 'pending' ? 
                                                      <div  style={{width: '20%'}} class="text-center">
                                                        <div style={{width: '20px',height: '20px'}} class="spinner-border text-primary" role="status">
                                                            <span class="sr-only">Loading...</span>
                                                        </div>
                                                      </div>
                                                    :  <div style={{width: '20%'}} class="text-center text-danger">{item.status !== 'Time limited execeeded' ? item.status : 'TLE'}</div>
                                                    }   
                                                </li>
                                            )
                                        })
                                    }
                                </ul> 
                                : null }
                            </div>
                        </div>
                    </div>
            )
        }  
    }
    return (
        <>
            <NavigationBar scope="limited"/>
            {toast}
            <div class="container position-relative">
                <div class="container shadow my-2 mt-5 p-3">
                    <div class="point-info text-left">
                        <h5>Total point: {}</h5>
                    </div>
                    <div class="contest-info w-100 text-center" style={{lineHeight: '25px', fontWeight: 'bold'}}>
                        <h3 class="text-secondary">{detail?.name || 'No contest name found'}</h3>
                    </div>
                    {questionDetail}
                </div>
                <div class="w-50 text-center m-auto">
                    <div class="my-2 btn btn-danger w-25" onClick={() => finishContest()}>Finish</div>
                </div>
            </div>
            <Footer scope="limited"/>
        </>
    )
}